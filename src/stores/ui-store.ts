import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  isNavOpen: boolean;
  activeSection: string | null;
  theme: 'dark' | 'light';
  isReducedMotion: boolean;

  setLoading: (loading: boolean) => void;
  setNavOpen: (open: boolean) => void;
  setActiveSection: (section: string | null) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  isNavOpen: false,
  activeSection: null,
  theme: 'dark',
  isReducedMotion: false,

  setLoading: (loading) => set({ isLoading: loading }),
  setNavOpen: (open) => set({ isNavOpen: open }),
  setActiveSection: (section) => set({ activeSection: section }),
  setTheme: (theme) => set({ theme }),
  setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
}));
