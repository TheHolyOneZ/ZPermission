import { create } from 'zustand'

export interface MenuItem {
  label: string
  action: () => void
  danger?: boolean
}

interface ContextMenuStore {
  visible: boolean
  x: number
  y: number
  items: MenuItem[]
  open: (x: number, y: number, items: MenuItem[]) => void
  close: () => void
}

export const useContextMenu = create<ContextMenuStore>((set) => ({
  visible: false,
  x: 0,
  y: 0,
  items: [],
  open: (x, y, items) => set({ visible: true, x, y, items }),
  close: () => set({ visible: false, items: [] }),
}))
