import { invoke } from '@tauri-apps/api/core'
import { create } from 'zustand'
import type { CommonDir, FileEntry, PermissionData } from '../types/permissions'
import { usePermissionStore } from './permissionStore'

interface FileStore {
  currentPath: string
  entries: FileEntry[]
  selectedPath: string | null
  loading: boolean
  commonDirs: CommonDir[]
  navigate: (path: string) => Promise<void>
  selectFile: (path: string) => void
  goUp: () => Promise<void>
  init: () => Promise<void>
}

export const useFileStore = create<FileStore>((set, get) => ({
  currentPath: '/',
  entries: [],
  selectedPath: null,
  loading: false,
  commonDirs: [],

  init: async () => {
    try {
      const [home, dirs] = await Promise.all([
        invoke<string>('get_home_dir'),
        invoke<CommonDir[]>('get_common_dirs'),
      ])
      set({ commonDirs: dirs })
      await get().navigate(home)
    } catch {
      await get().navigate('/')
    }
  },

  navigate: async (path) => {
    set({ loading: true })
    try {
      const entries = await invoke<FileEntry[]>('list_directory', { path })
      set({ currentPath: path, entries, loading: false, selectedPath: null })
      usePermissionStore.getState().setData({
        path,
        owner: '',
        group: '',
        unix_mode: null,
        acl_entries: [],
        platform: '',
      })
    } catch {
      set({ loading: false })
    }
  },

  selectFile: (path) => {
    set({ selectedPath: path })
    invoke<PermissionData>('get_file_permissions', { path })
      .then((data) => usePermissionStore.getState().setData(data))
      .catch(() => {})
  },

  goUp: async () => {
    const { currentPath } = get()
    const parts = currentPath.replace(/\\/g, '/').split('/').filter(Boolean)
    const parent = parts.length > 0 ? '/' + parts.slice(0, -1).join('/') : '/'
    await get().navigate(parent || '/')
  },
}))
