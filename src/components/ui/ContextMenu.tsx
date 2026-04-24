import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useContextMenu } from '../../store/contextMenuStore'

export function ContextMenu() {
  const { visible, x, y, items, close } = useContextMenu()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [visible, close])

  const clampedX = typeof window !== 'undefined' ? Math.min(x, window.innerWidth - 180) : x
  const clampedY = typeof window !== 'undefined' ? Math.min(y, window.innerHeight - items.length * 36 - 16) : y

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.92, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
          className="fixed z-50 py-1.5 rounded-xl overflow-hidden"
          style={{
            left: clampedX,
            top: clampedY,
            minWidth: 164,
            background: 'rgba(14,18,28,0.92)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.action(); close() }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-mono text-left transition-colors"
              style={{ color: item.danger ? '#f87171' : 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = item.danger
                  ? 'rgba(248,113,113,0.1)'
                  : 'rgba(255,255,255,0.07)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
