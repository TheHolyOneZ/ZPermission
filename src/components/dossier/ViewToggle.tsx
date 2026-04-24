import { motion } from 'framer-motion'
import { usePermissionStore } from '../../store/permissionStore'

export function ViewToggle() {
  const { viewMode, setViewMode } = usePermissionStore()

  return (
    <div
      className="flex rounded-lg p-0.5 text-xs font-mono"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {(['simple', 'advanced'] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className="relative px-3 py-1 rounded-md transition-colors"
          style={{ color: viewMode === mode ? '#fff' : 'rgba(255,255,255,0.35)' }}
        >
          {viewMode === mode && (
            <motion.div
              layoutId="vtbg"
              className="absolute inset-0 rounded-md"
              style={{ background: 'rgba(74,158,255,0.18)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative">{mode}</span>
        </button>
      ))}
    </div>
  )
}
