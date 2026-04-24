interface Perms {
  read: boolean
  write: boolean
  execute: boolean
}

interface Props {
  identity: string
  type: 'user' | 'group'
  isOwner?: boolean
  permissions?: Perms
}

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const GroupIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const PERM_COLORS: Record<string, string> = {
  R: '#4ade80',
  W: '#fb923c',
  X: '#a78bfa',
}

export function IdentityCard({ identity, type, isOwner, permissions }: Props) {
  const accent = type === 'user' ? '#4a9eff' : '#a855f7'

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl mx-3 mb-2"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: isOwner
          ? '1px solid rgba(74,158,255,0.22)'
          : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
        style={{ background: `${accent}22`, color: accent }}
      >
        {type === 'user' ? <UserIcon /> : <GroupIcon />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-xs font-mono text-white/80 truncate">{identity || '—'}</div>
        <div className="text-xs font-mono text-white/30">
          {isOwner ? 'owner · ' : ''}
          {type}
        </div>
      </div>

      {permissions && (
        <div className="flex gap-1 flex-shrink-0">
          {(['R', 'W', 'X'] as const).map((label) => {
            const active =
              label === 'R' ? permissions.read : label === 'W' ? permissions.write : permissions.execute
            return (
              <div
                key={label}
                className="flex items-center justify-center w-5 h-5 rounded-md text-xs font-mono font-bold"
                style={{
                  background: active ? `${PERM_COLORS[label]}18` : 'rgba(255,255,255,0.04)',
                  border: active
                    ? `1px solid ${PERM_COLORS[label]}55`
                    : '1px solid rgba(255,255,255,0.07)',
                  color: active ? PERM_COLORS[label] : 'rgba(255,255,255,0.18)',
                }}
              >
                {label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
