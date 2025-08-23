import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto, UpdateFolderDto } from './dto';
export declare class FoldersService {
    private prisma;
    constructor(prisma: PrismaService);
    createFolder(userId: string, createFolderDto: CreateFolderDto): Promise<{
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
    getUserFolders(userId: string): Promise<({
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
    updateFolder(userId: string, folderId: string, updateFolderDto: UpdateFolderDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        color: import("@prisma/client").$Enums.FolderColor;
    }>;
    deleteFolder(userId: string, folderId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        color: import("@prisma/client").$Enums.FolderColor;
    }>;
}
