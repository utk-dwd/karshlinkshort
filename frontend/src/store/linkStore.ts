// frontend/src/store/linkStore.ts
import { create } from 'zustand';
import api from '@/services/api';
import type {
  User, Link, Folder,
  CreateLinkData, UpdateLinkData,
  CreateFolderData, UpdateFolderData
} from '@/types';

interface LinkStore {
  user: User | null;
  isAuthenticated: boolean;
  links: Link[];
  folders: Folder[];
  isLoading: boolean;
  error: string | null;

  // Auth
  login: (token: string) => Promise<void>;
  logout: () => void;
  
  // Data Fetching
  fetchAllData: () => Promise<void>;

  // Links
  createLink: (data: CreateLinkData) => Promise<Link>;
  updateLink: (id: string, data: UpdateLinkData) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;

  // Folders
  createFolder: (data: CreateFolderData) => Promise<Folder>;
  updateFolder: (id: string, data: UpdateFolderData) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

export const useLinkStore = create<LinkStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  links: [],
  folders: [],
  isLoading: false,
  error: null,

  // --- AUTH ---
  login: async (token: string) => {
    set({ isLoading: true });
    localStorage.setItem('auth_token', token);
    try {
      const response = await api.get<User>('/auth/me');
      set({ user: response.data, isAuthenticated: true, error: null });
      await get().fetchAllData();
    } catch (e) {
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false, links: [], folders: [] });
  },

  // --- DATA FETCHING ---
  fetchAllData: async () => {
    if (!get().isAuthenticated) return;
    set({ isLoading: true });
    try {
      const [linksRes, foldersRes] = await Promise.all([
        api.get<Link[]>('/links'),
        api.get<Folder[]>('/folders'),
      ]);
      set({ links: linksRes.data, folders: foldersRes.data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch data.' });
    } finally {
      set({ isLoading: false });
    }
  },

  // --- LINKS ---
  createLink: async (data) => {
    const response = await api.post<Link>('/links', data);
    set((state) => ({ links: [response.data, ...state.links] }));
    return response.data;
  },
  updateLink: async (id, data) => {
    const response = await api.patch<Link>(`/links/${id}`, data);
    set((state) => ({
      links: state.links.map((l) => (l.id === id ? response.data : l)),
    }));
  },
  deleteLink: async (id) => {
    await api.delete(`/links/${id}`);
    set((state) => ({ links: state.links.filter((l) => l.id !== id) }));
  },

  // --- FOLDERS ---
  createFolder: async (data) => {
    const response = await api.post<Folder>('/folders', data);
    set((state) => ({ folders: [response.data, ...state.folders] }));
    return response.data;
  },
  updateFolder: async (id, data) => {
    const response = await api.patch<Folder>(`/folders/${id}`, data);
    set((state) => ({
      folders: state.folders.map((f) => (f.id === id ? response.data : f)),
    }));
  },
  deleteFolder: async (id) => {
    await api.delete(`/folders/${id}`);
    set((state) => ({ folders: state.folders.filter((f) => f.id !== id) }));
  },
}));