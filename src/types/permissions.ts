export interface PermissionData {
  path: string
  owner: string
  group: string
  unix_mode: number | null
  acl_entries: AclEntry[]
  platform: string
}

export interface AclEntry {
  identity: string
  identity_type: string
  read: boolean
  write: boolean
  execute: boolean
  special: string | null
}

export interface PermissionChange {
  entryIndex: number
  field: 'read' | 'write' | 'execute'
  value: boolean
}

export interface FileEntry {
  name: string
  path: string
  is_dir: boolean
  size: number
  modified: number
}

export interface PermissionChangeset {
  unix_mode?: number
  owner?: string
  acl_entries?: AclEntry[]
}

export interface CommonDir {
  name: string
  path: string
}
