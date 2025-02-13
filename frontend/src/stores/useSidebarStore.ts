import { create } from "zustand";

interface SidebarStore {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isVisible: true,
  setIsVisible: (visible) => set({ isVisible: visible }),
})); 