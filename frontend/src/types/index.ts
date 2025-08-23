// frontend/src/types/index.ts
import { FolderColor } from '@prisma/client'; // Assuming you might share enums

// --- Data Models (from Prisma/API Responses) ---
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  plan: 'FREE' | 'PRO' | 'BUSINESS';
}

export enum FolderColor {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  RED = 'RED',
  YELLOW = 'YELLOW',
}

export interface Folder {
  id: string;
  name: string;
  color: FolderColor;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { links: number };
}

export interface Link {
  id:string;
  originalUrl: string;
  shortCode: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  clicks: number;
  isActive: boolean;
  expiresAt: string | null;
  userId: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- API Payloads (from DTOs) ---

// Matches create-link.dto.ts
export interface CreateLinkData {
  originalUrl: string;
  customCode?: string;
  folderId?: string;
  expiresAt?: Date;
  password?: string;
}

// Matches update-link.dto.ts
export type UpdateLinkData = Partial<CreateLinkData>;

// Matches create-folder.dto.ts
export interface CreateFolderData {
  name: string;
  color: FolderColor;
}

// Matches update-folder.dto.ts
export type UpdateFolderData = Partial<CreateFolderData>;