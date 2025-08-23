import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto, UpdateLinkDto } from './dto';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { UAParser } from 'ua-parser-js';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async createLink(userId: string, createLinkDto: CreateLinkDto) {
    const { originalUrl, customCode, folderId, expiresAt, password } = createLinkDto;
    
    let shortCode = customCode;
    if (!shortCode) {
      do {
        shortCode = nanoid();
      } while (await this.prisma.link.findUnique({ where: { shortCode } }));
    } else {
      const existing = await this.prisma.link.findUnique({ where: { shortCode } });
      if (existing) {
        throw new ConflictException('Short code already exists');
      }
    }
    
    const metadata = await this.fetchUrlMetadata(originalUrl);
    
    return this.prisma.link.create({
      data: {
        originalUrl,
        shortCode,
        title: metadata.title,
        description: metadata.description,
        favicon: metadata.favicon,
        userId,
        folderId,
        expiresAt,
        password: password ? await bcrypt.hash(password, 10) : null,
      },
      include: {
        folder: true,
        _count: {
          select: { analytics: true },
        },
      },
    });
  }

  async getUserLinks(userId: string) {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        folder: true,
        _count: {
          select: { analytics: true },
        },
      },
    });
  }

  async updateLink(userId: string, linkId: string, updateLinkDto: UpdateLinkDto) {
    const link = await this.prisma.link.findFirst({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    let passwordHash = updateLinkDto.password;
    if (updateLinkDto.password) {
      passwordHash = await bcrypt.hash(updateLinkDto.password, 10);
    }
    
    return this.prisma.link.update({
      where: { id: linkId },
      data: {
        ...updateLinkDto,
        password: passwordHash,
      },
    });
  }

  async deleteLink(userId: string, linkId: string) {
    const link = await this.prisma.link.findFirst({ where: { id: linkId, userId } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return this.prisma.link.delete({ where: { id: linkId } });
  }

  async redirectLink(shortCode: string, password?: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortCode },
      include: { user: true },
    });
    
    if (!link || !link.isActive) {
      throw new NotFoundException('Link not found');
    }
    
    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new NotFoundException('Link has expired');
    }
    
    if (link.password && (!password || !await bcrypt.compare(password, link.password))) {
      throw new ForbiddenException('Password required');
    }
    
    await this.prisma.link.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });

    return { redirectUrl: link.originalUrl };
  }

  async recordClick(linkId: string, request: any) {
    const userAgent = request.headers['user-agent'];
    const referer = request.headers.referer;
    const ip = request.ip;
    
    const deviceInfo = this.parseUserAgent(userAgent);
    const geoInfo = await this.getGeoLocation(ip);
    
    return this.prisma.clickAnalytic.create({
      data: {
        linkId,
        userAgent,
        referer,
        ip,
        country: geoInfo.country,
        city: geoInfo.city,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      },
    });
  }

  private async fetchUrlMetadata(url: string) {
    try {
      const { data } = await axios.get(url, { responseType: 'text' });
      const $ = cheerio.load(data);
      const title = $('title').text();
      const description = $('meta[name="description"]').attr('content');
      const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');

      return {
        title: title || null,
        description: description || null,
        favicon: favicon ? new URL(favicon, url).href : null,
      };
    } catch (error) {
      console.error('Failed to fetch URL metadata:', error);
      return { title: null, description: null, favicon: null };
    }
  }

  private parseUserAgent(userAgent: string) {
    const result = UAParser(userAgent);

  return {
    device: result.device.type || 'desktop',
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
  };
}

  private async getGeoLocation(ip: string) {
    // In a real-world scenario, you would use a service like ip-api.com
    // or MaxMind's GeoLite2 to get geo-location data from the IP.
    // For now, this is a placeholder.
    return {
      country: 'Unknown',
      city: 'Unknown',
    };
  }
}