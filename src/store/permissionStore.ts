import { invoke } from '@tauri-apps/api/core'
import { create } from 'zustand'
import type { AclEntry, PermissionChange, PermissionData } from '../types/permissions'

interface PermissionStore {
  currentData: PermissionData | null
  stagedChanges: PermissionChange[]
  stagedSpecialBits: number | null
  viewMode: 'simple' | 'advanced'
  loading: boolean
  error: string | null
  setData: (data: PermissionData) => void
  stageChange: (change: PermissionChange) => void
  stageOctal: (mode: number) => void
  stageSpecialBit: (mask: number, on: boolean) => void
  discardChanges: () => void
  applyChanges: () => Promise<void>
  setViewMode: (mode: 'simple' | 'advanced') => void
  clearError: () => void
  effectiveMode: () => number
}

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  currentData: null,
  stagedChanges: [],
  stagedSpecialBits: null,
  viewMode: 'simple',
  loading: false,
  error: null,

  setData: (data) =>
    set({ currentData: data, stagedChanges: [], stagedSpecialBits: null, error: null }),

  stageChange: (change) =>
    set((state) => ({
      stagedChanges: [
        ...state.stagedChanges.filter(
          (c) => !(c.entryIndex === change.entryIndex && c.field === change.field)
        ),
        change,
      ],
    })),

  stageOctal: (mode) => {
    const rwx = mode & 0o777
    const special = mode & 0o7000
    const bits = [
      { entryIndex: 0, field: 'read' as const, mask: 0o400 },
      { entryIndex: 0, field: 'write' as const, mask: 0o200 },
      { entryIndex: 0, field: 'execute' as const, mask: 0o100 },
      { entryIndex: 1, field: 'read' as const, mask: 0o040 },
      { entryIndex: 1, field: 'write' as const, mask: 0o020 },
      { entryIndex: 1, field: 'execute' as const, mask: 0o010 },
      { entryIndex: 2, field: 'read' as const, mask: 0o004 },
      { entryIndex: 2, field: 'write' as const, mask: 0o002 },
      { entryIndex: 2, field: 'execute' as const, mask: 0o001 },
    ]
    set({
      stagedChanges: bits.map(({ entryIndex, field, mask }) => ({
        entryIndex,
        field,
        value: (rwx & mask) !== 0,
      })),
      stagedSpecialBits: special,
    })
  },

  stageSpecialBit: (mask, on) => {
    const { currentData, stagedSpecialBits } = get()
    const base =
      stagedSpecialBits !== null
        ? stagedSpecialBits
        : currentData?.unix_mode
        ? currentData.unix_mode & 0o7000
        : 0
    set({ stagedSpecialBits: on ? base | mask : base & ~mask })
  },

  discardChanges: () => set({ stagedChanges: [], stagedSpecialBits: null }),

  clearError: () => set({ error: null }),

  effectiveMode: () => {
    const { currentData, stagedChanges, stagedSpecialBits } = get()
    if (!currentData || currentData.unix_mode === null) return 0
    const specialBits =
      stagedSpecialBits !== null ? stagedSpecialBits : currentData.unix_mode & 0o7000
    const entries = currentData.acl_entries.map((e, i) => {
      const changes = stagedChanges.filter((c) => c.entryIndex === i)
      return changes.reduce((acc, c) => ({ ...acc, [c.field]: c.value }), e)
    })
    return specialBits | buildUnixMode(entries)
  },

  applyChanges: async () => {
    const { currentData, effectiveMode, stagedChanges, stagedSpecialBits } = get()
    if (!currentData) return
    if (stagedChanges.length === 0 && stagedSpecialBits === null) return
    set({ loading: true, error: null })
    try {
      if (currentData.unix_mode !== null) {
        const mode = effectiveMode()
        await invoke('set_file_permissions', {
          path: currentData.path,
          changes: { unix_mode: mode },
        })
      } else {
        const entries = currentData.acl_entries.map((e, i) => {
          const changes = stagedChanges.filter((c) => c.entryIndex === i)
          return changes.reduce((acc, c) => ({ ...acc, [c.field]: c.value }), e)
        })
        await invoke('set_file_permissions', {
          path: currentData.path,
          changes: { acl_entries: entries },
        })
      }
      const updated = await invoke<PermissionData>('get_file_permissions', {
        path: currentData.path,
      })
      set({ currentData: updated, stagedChanges: [], stagedSpecialBits: null, loading: false })
    } catch (e) {
      set({ error: String(e), loading: false })
    }
  },

  setViewMode: (mode) => set({ viewMode: mode }),
}))

function buildUnixMode(entries: AclEntry[]): number {
  let mode = 0
  if (entries[0]?.read) mode |= 0o400
  if (entries[0]?.write) mode |= 0o200
  if (entries[0]?.execute) mode |= 0o100
  if (entries[1]?.read) mode |= 0o040
  if (entries[1]?.write) mode |= 0o020
  if (entries[1]?.execute) mode |= 0o010
  if (entries[2]?.read) mode |= 0o004
  if (entries[2]?.write) mode |= 0o002
  if (entries[2]?.execute) mode |= 0o001
  return mode
}
