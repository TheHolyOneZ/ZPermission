import type { AclEntry } from '../../types/permissions'

interface Props {
  entry: AclEntry
  index: number
}

export function AclEntryRow({ entry, index }: Props) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 mx-3 mb-1 rounded-lg text-xs font-mono"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      key={index}
    >
      <span className="text-white/50 truncate flex-1">{entry.identity}</span>
      <div className="flex gap-1.5">
        {(['read', 'write', 'execute'] as const).map((p) => (
          <span key={p} style={{ color: entry[p] ? '#4a9eff' : 'rgba(255,255,255,0.15)' }}>
            {p[0].toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  )
}
