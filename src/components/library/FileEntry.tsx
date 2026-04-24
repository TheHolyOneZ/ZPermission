import { motion } from 'framer-motion'
import type { FileEntry } from '../../types/permissions'
import { useContextMenu } from '../../store/contextMenuStore'

interface Props {
  entry: FileEntry
  selected: boolean
  onSelect: () => void
  onNavigate?: () => void
}

const FolderIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
)

function fmtSize(b: number): string {
  if (b < 1024) return `${b}B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)}K`
  return `${(b / 1048576).toFixed(1)}M`
}

export function FileEntryRow({ entry, selected, onSelect, onNavigate }: Props) {
  const openMenu = useContextMenu((s) => s.open)

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const items = [
      {
        label: 'Inspect permissions',
        action: () => onSelect(),
      },
      {
        label: 'Copy path',
        action: () => navigator.clipboard.writeText(entry.path).catch(() => {}),
      },
    ]

    if (entry.is_dir && onNavigate) {
      items.push({ label: 'Navigate here', action: () => onNavigate!() })
    }

    openMenu(e.clientX, e.clientY, items)
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.055)' }}
      onClick={() => {
        onSelect()
        if (entry.is_dir && onNavigate) onNavigate()
      }}
      onContextMenu={handleContextMenu}
      className="flex items-center gap-2.5 px-3 py-2 mx-2 rounded-xl cursor-pointer transition-colors"
      style={{
        backgroundColor: selected ? 'rgba(74,158,255,0.11)' : undefined,
        border: selected ? '1px solid rgba(74,158,255,0.22)' : '1px solid transparent',
      }}
    >
      <span style={{ color: entry.is_dir ? '#4a9eff' : '#64748b', flexShrink: 0 }}>
        {entry.is_dir ? <FolderIcon /> : <FileIcon />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white/75 font-mono truncate">{entry.name}</div>
        {!entry.is_dir && (
          <div className="text-xs text-white/25 font-mono">{fmtSize(entry.size)}</div>
        )}
      </div>
      {entry.is_dir && <span className="text-white/20 text-xs font-mono">›</span>}
    </motion.div>
  )
}
