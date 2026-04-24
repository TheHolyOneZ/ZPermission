import { open } from '@tauri-apps/plugin-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useFileStore } from '../../store/fileStore'
import { DossierPanel } from '../layout/DossierPanel'
import { FileEntryRow } from './FileEntry'

const UpIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const FolderOpenIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const SearchIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const PIN_ICONS: Record<string, () => JSX.Element> = {
  Home: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Desktop: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Documents: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
    </svg>
  ),
  Downloads: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Root: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  System: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
}

function DefaultPinIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function DossierLibrary() {
  const { currentPath, entries, selectedPath, navigate, selectFile, goUp, loading, commonDirs } =
    useFileStore()
  const [search, setSearch] = useState('')
  const [pinnedOpen, setPinnedOpen] = useState(true)

  const filtered = search.trim()
    ? entries.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    : entries

  async function browse() {
    const dir = await open({ directory: true, multiple: false, title: 'Select Directory' })
    if (typeof dir === 'string') navigate(dir)
  }

  return (
    <DossierPanel title="Permission Dossier Library" subtitle="Navigator" delay={0}>
      {commonDirs.length > 0 && (
        <div
          className="flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <button
            onClick={() => setPinnedOpen((v) => !v)}
            className="w-full flex items-center gap-1.5 px-3 pt-2.5 pb-2 text-xs font-mono text-white/25 hover:text-white/45 transition-colors uppercase tracking-widest"
          >
            <motion.span
              animate={{ rotate: pinnedOpen ? 90 : 0 }}
              transition={{ duration: 0.18 }}
              className="inline-block"
              style={{ fontSize: 9 }}
            >
              ›
            </motion.span>
            Pinned
          </button>
          <AnimatePresence initial={false}>
            {pinnedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 px-2.5 pb-2.5">
                  {commonDirs.map((dir) => {
                    const IconComp = PIN_ICONS[dir.name] ?? DefaultPinIcon
                    const active = currentPath === dir.path
                    return (
                      <motion.button
                        key={dir.path}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => navigate(dir.path)}
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-mono transition-all"
                        style={{
                          background: active ? 'rgba(74,158,255,0.14)' : 'rgba(255,255,255,0.05)',
                          border: active
                            ? '1px solid rgba(74,158,255,0.3)'
                            : '1px solid rgba(255,255,255,0.08)',
                          color: active ? '#4a9eff' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        <span style={{ color: active ? '#4a9eff' : 'rgba(255,255,255,0.3)' }}>
                          <IconComp />
                        </span>
                        {dir.name}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <motion.div
        className="flex items-center gap-1.5 px-2.5 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        layout
      >
        <button
          onClick={goUp}
          title="Go up"
          className="flex items-center justify-center w-6 h-6 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/8 transition-all flex-shrink-0"
        >
          <UpIcon />
        </button>
        <span
          className="text-xs text-white/25 font-mono truncate flex-1 select-none"
          title={currentPath}
        >
          {currentPath}
        </span>
        <button
          onClick={browse}
          title="Browse directory"
          className="flex items-center justify-center w-6 h-6 rounded-lg text-white/40 hover:text-white/60 transition-all flex-shrink-0"
        >
          <FolderOpenIcon />
        </button>
      </motion.div>

      <div
        className="px-2.5 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span className="text-white/30 flex-shrink-0">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="filter..."
            className="flex-1 bg-transparent text-xs font-mono text-white/70 placeholder-white/20 outline-none min-w-0"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setSearch('')}
                className="text-white/30 hover:text-white/60 transition-colors text-xs leading-none"
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-1.5">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/20 text-xs font-mono py-6"
          >
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              loading…
            </motion.span>
          </motion.div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-white/20 text-xs font-mono py-6">
            {search ? 'no matches' : 'empty'}
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {!loading &&
            filtered.map((entry) => (
              <motion.div
                key={entry.path}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
              >
                <FileEntryRow
                  entry={entry}
                  selected={selectedPath === entry.path}
                  onSelect={() => selectFile(entry.path)}
                  onNavigate={entry.is_dir ? () => navigate(entry.path) : undefined}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </DossierPanel>
  )
}
