import { motion, AnimatePresence } from 'framer-motion'
import { DossierPanel } from '../layout/DossierPanel'
import { PermissionMatrix } from './PermissionMatrix'
import { ViewToggle } from './ViewToggle'
import { usePermissionStore } from '../../store/permissionStore'

function OctalBadge({ mode }: { mode: number }) {
  const oct = (mode & 0o777).toString(8).padStart(3, '0')
  return (
    <div>
      <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">Mode</div>
      <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: '#4a9eff' }}>
        {oct}
      </div>
    </div>
  )
}

export function ActiveDossier() {
  const { currentData, stagedChanges, applyChanges, discardChanges, loading, error, clearError } =
    usePermissionStore()

  const fileName = currentData?.path
    ? currentData.path.replace(/\\/g, '/').split('/').pop() || currentData.path
    : '—'

  return (
    <DossierPanel title={fileName} subtitle="Active File/Folder" delay={0.09}>
      <div className="flex flex-col h-full">
        {currentData && currentData.owner && (
          <div
            className="px-4 py-3 flex items-start gap-6 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div>
              <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">
                Owner
              </div>
              <div className="text-sm font-mono text-white/75">{currentData.owner}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-0.5">
                Group
              </div>
              <div className="text-sm font-mono text-white/75">{currentData.group}</div>
            </div>
            {currentData.unix_mode !== null && (
              <div className="ml-auto">
                <OctalBadge mode={currentData.unix_mode} />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
            Permission Matrix
          </span>
          <ViewToggle />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-3">
          <PermissionMatrix />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mb-2 px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between"
              style={{
                background: 'rgba(255,74,74,0.12)',
                border: '1px solid rgba(255,74,74,0.28)',
                color: '#ff6b6b',
              }}
            >
              <span className="truncate">{error}</span>
              <button onClick={clearError} className="ml-2 text-white/40 hover:text-white/70 flex-shrink-0">
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stagedChanges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex gap-2 px-4 pb-4 flex-shrink-0"
            >
              <button
                onClick={discardChanges}
                className="flex-1 py-2 rounded-xl text-xs font-mono text-white/45 hover:text-white/70 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                discard ({stagedChanges.length})
              </button>
              <button
                onClick={applyChanges}
                disabled={loading}
                className="flex-1 py-2 rounded-xl text-xs font-mono font-semibold transition-all"
                style={{
                  background: loading ? 'rgba(74,158,255,0.08)' : 'rgba(74,158,255,0.18)',
                  border: '1px solid rgba(74,158,255,0.38)',
                  color: '#4a9eff',
                }}
              >
                {loading ? 'applying…' : 'apply'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DossierPanel>
  )
}
