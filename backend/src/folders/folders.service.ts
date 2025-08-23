import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto, UpdateFolderDto } from './dto';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  async createFolder(userId: string, createFolderDto: CreateFolderDto) {
    return this.prisma.folder.create({
      data: {
        ...createFolderDto,
        userId,
      },
      include: {
        _count: {
          select: { links: true },
        },
      },
    });
  }

  async getUserFolders(userId: string) {
    return this.prisma.folder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { links: true },
        },
        links: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            shortCode: true,
            clicks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateFolder(userId: string, folderId: string, updateFolderDto: UpdateFolderDto) {
    const folder = await this.prisma.folder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    return this.prisma.folder.update({
      where: { id: folderId },
      data: updateFolderDto,
    });
  }

  async deleteFolder(userId: string, folderId: string) {
    const folder = await this.prisma.folder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    // Move links to no folder before deleting
    await this.prisma.link.updateMany({
      where: { folderId },
      data: { folderId: null },
    });
    return this.prisma.folder.delete({
      where: { id: folderId },
    });
  }
}