import { create } from 'zustand'

interface UIStore {
  showAbout: boolean
  openAbout: () => void
  closeAbout: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  showAbout: false,
  openAbout: () => set({ showAbout: true }),
  closeAbout: () => set({ showAbout: false }),
}))
