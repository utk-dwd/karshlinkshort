import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  alias?: string;
  folder?: string;
  createdAt: Date;
  clicks: number;
  isActive: boolean;
}

export interface Folder {
  id: string;
  name: string;
  color: 'orange' | 'blue' | 'green' | 'purple';
  linkCount: number;
  createdAt: Date;
}

interface LinkStore {
  links: Link[];
  folders: Folder[];
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
    totalLinks: number;
    totalClicks: number;
  } | null;
  
  // Actions
  addLink: (originalUrl: string, alias?: string, folder?: string) => string;
  updateLink: (id: string, updates: Partial<Link>) => void;
  deleteLink: (id: string) => void;
  addFolder: (name: string, color: Folder['color']) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setUser: (user: LinkStore['user']) => void;
  incrementClicks: (id: string) => void;
}

// Generate random short code
const generateShortCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useLinkStore = create<LinkStore>()(
  persist(
    (set, get) => ({
      links: [],
      folders: [
        {
          id: '1',
          name: 'Work',
          color: 'blue',
          linkCount: 0,
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Personal',
          color: 'green',
          linkCount: 0,
          createdAt: new Date(),
        },
      ],
      isAuthenticated: false,
      user: null,

      addLink: (originalUrl: string, alias?: string, folder?: string) => {
        const shortCode = alias || generateShortCode();
        const newLink: Link = {
          id: Date.now().toString(),
          originalUrl,
          shortCode,
          shortUrl: `karsh.link/${shortCode}`,
          alias,
          folder,
          createdAt: new Date(),
          clicks: 0,
          isActive: true,
        };

        set((state) => ({
          links: [newLink, ...state.links],
          folders: state.folders.map((f) =>
            f.id === folder ? { ...f, linkCount: f.linkCount + 1 } : f
          ),
        }));

        return newLink.id;
      },

      updateLink: (id: string, updates: Partial<Link>) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updates } : link
          ),
        }));
      },

      deleteLink: (id: string) => {
        set((state) => {
          const link = state.links.find((l) => l.id === id);
          return {
            links: state.links.filter((l) => l.id !== id),
            folders: state.folders.map((f) =>
              f.id === link?.folder ? { ...f, linkCount: Math.max(0, f.linkCount - 1) } : f
            ),
          };
        });
      },

      addFolder: (name: string, color: Folder['color']) => {
        const newFolder: Folder = {
          id: Date.now().toString(),
          name,
          color,
          linkCount: 0,
          createdAt: new Date(),
        };

        set((state) => ({
          folders: [...state.folders, newFolder],
        }));
      },

      updateFolder: (id: string, updates: Partial<Folder>) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        }));
      },

      deleteFolder: (id: string) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          links: state.links.map((link) =>
            link.folder === id ? { ...link, folder: undefined } : link
          ),
        }));
      },

      setAuthenticated: (isAuth: boolean) => {
        set({ isAuthenticated: isAuth });
      },

      setUser: (user: LinkStore['user']) => {
        set({ user, isAuthenticated: !!user });
      },

      incrementClicks: (id: string) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, clicks: link.clicks + 1 } : link
          ),
        }));
      },
    }),
    {
      name: 'karsh-link-store',
    }
  )
);