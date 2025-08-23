import { LinksService } from './links.service';
import { CreateLinkDto, UpdateLinkDto } from './dto';
import type { Request } from 'express';
export declare class LinksController {
    private readonly linksService;
    constructor(linksService: LinksService);
    create(createLinkDto: CreateLinkDto, req: Request): Promise<{
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
    findAll(req: Request): Promise<({
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
    redirect(shortCode: string, req: Request): Promise<{
        redirectUrl: string;
    }>;
    update(id: string, updateLinkDto: UpdateLinkDto, req: Request): Promise<{
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
    remove(id: string, req: Request): Promise<{
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
}
