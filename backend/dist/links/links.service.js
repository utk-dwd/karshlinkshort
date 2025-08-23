"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nanoid_1 = require("nanoid");
const bcrypt = __importStar(require("bcryptjs"));
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const ua_parser_js_1 = require("ua-parser-js");
const nanoid = (0, nanoid_1.customAlphabet)('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
let LinksService = class LinksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLink(userId, createLinkDto) {
        const { originalUrl, customCode, folderId, expiresAt, password } = createLinkDto;
        let shortCode = customCode;
        if (!shortCode) {
            do {
                shortCode = nanoid();
            } while (await this.prisma.link.findUnique({ where: { shortCode } }));
        }
        else {
            const existing = await this.prisma.link.findUnique({ where: { shortCode } });
            if (existing) {
                throw new common_1.ConflictException('Short code already exists');
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
    async getUserLinks(userId) {
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
    async updateLink(userId, linkId, updateLinkDto) {
        const link = await this.prisma.link.findFirst({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found');
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
    async deleteLink(userId, linkId) {
        const link = await this.prisma.link.findFirst({ where: { id: linkId, userId } });
        if (!link) {
            throw new common_1.NotFoundException('Link not found');
        }
        return this.prisma.link.delete({ where: { id: linkId } });
    }
    async redirectLink(shortCode, password) {
        const link = await this.prisma.link.findUnique({
            where: { shortCode },
            include: { user: true },
        });
        if (!link || !link.isActive) {
            throw new common_1.NotFoundException('Link not found');
        }
        if (link.expiresAt && new Date() > link.expiresAt) {
            throw new common_1.NotFoundException('Link has expired');
        }
        if (link.password && (!password || !await bcrypt.compare(password, link.password))) {
            throw new common_1.ForbiddenException('Password required');
        }
        await this.prisma.link.update({
            where: { id: link.id },
            data: { clicks: { increment: 1 } },
        });
        return { redirectUrl: link.originalUrl };
    }
    async recordClick(linkId, request) {
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
    async fetchUrlMetadata(url) {
        try {
            const { data } = await axios_1.default.get(url, { responseType: 'text' });
            const $ = cheerio.load(data);
            const title = $('title').text();
            const description = $('meta[name="description"]').attr('content');
            const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
            return {
                title: title || null,
                description: description || null,
                favicon: favicon ? new URL(favicon, url).href : null,
            };
        }
        catch (error) {
            console.error('Failed to fetch URL metadata:', error);
            return { title: null, description: null, favicon: null };
        }
    }
    parseUserAgent(userAgent) {
        const result = (0, ua_parser_js_1.UAParser)(userAgent);
        return {
            device: result.device.type || 'desktop',
            browser: result.browser.name || 'Unknown',
            os: result.os.name || 'Unknown',
        };
    }
    async getGeoLocation(ip) {
        return {
            country: 'Unknown',
            city: 'Unknown',
        };
    }
};
exports.LinksService = LinksService;
exports.LinksService = LinksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LinksService);
//# sourceMappingURL=links.service.js.map