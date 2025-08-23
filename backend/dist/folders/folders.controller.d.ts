import { FoldersService } from './folders.service';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import type { Request } from 'express';
export declare class FoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    create(createFolderDto: CreateFolderDto, req: Request): Promise<{
        _count: {
            links: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        color: import("@prisma/client").$Enums.FolderColor;
    }>;
    findAll(req: Request): Promise<({
        links: {
            id: string;
            shortCode: string;
            clicks: number;
        }[];
        _count: {
            links: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        color: import("@prisma/client").$Enums.FolderColor;
    })[]>;
    update(id: string, updateFolderDto: UpdateFolderDto, req: Request): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        color: import("@prisma/client").$Enums.FolderColor;
    }>;
    remove(id: string, req: Request): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        color: import("@prisma/client").$Enums.FolderColor;
    }>;
}
