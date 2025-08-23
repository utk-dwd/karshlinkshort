import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto, UpdateLinkDto } from './dto';
export declare class LinksService {
    private prisma;
    constructor(prisma: PrismaService);
    createLink(userId: string, createLinkDto: CreateLinkDto): Promise<{
        folder: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            color: import("@prisma/client").$Enums.FolderColor;
        } | null;
        _count: {
            analytics: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        folderId: string | null;
        expiresAt: Date | null;
        password: string | null;
        shortCode: string;
        title: string | null;
        description: string | null;
        favicon: string | null;
        clicks: number;
        isActive: boolean;
        userId: string;
    }>;
    getUserLinks(userId: string): Promise<({
        folder: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            color: import("@prisma/client").$Enums.FolderColor;
        } | null;
        _count: {
            analytics: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        folderId: string | null;
        expiresAt: Date | null;
        password: string | null;
        shortCode: string;
        title: string | null;
        description: string | null;
        favicon: string | null;
        clicks: number;
        isActive: boolean;
        userId: string;
    })[]>;
    updateLink(userId: string, linkId: string, updateLinkDto: UpdateLinkDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        folderId: string | null;
        expiresAt: Date | null;
        password: string | null;
        shortCode: string;
        title: string | null;
        description: string | null;
        favicon: string | null;
        clicks: number;
        isActive: boolean;
        userId: string;
    }>;
    deleteLink(userId: string, linkId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        folderId: string | null;
        expiresAt: Date | null;
        password: string | null;
        shortCode: string;
        title: string | null;
        description: string | null;
        favicon: string | null;
        clicks: number;
        isActive: boolean;
        userId: string;
    }>;
    redirectLink(shortCode: string, password?: string): Promise<{
        redirectUrl: string;
    }>;
    recordClick(linkId: string, request: any): Promise<{
        id: string;
        userAgent: string | null;
        referer: string | null;
        ip: string | null;
        country: string | null;
        city: string | null;
        device: string | null;
        browser: string | null;
        os: string | null;
        clickedAt: Date;
        linkId: string;
    }>;
    private fetchUrlMetadata;
    private parseUserAgent;
    private getGeoLocation;
}
