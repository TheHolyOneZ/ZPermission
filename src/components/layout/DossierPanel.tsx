import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  delay?: number
}

export function DossierPanel({ title, subtitle, children, className = '', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`flex flex-col rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-xs font-mono tracking-widest uppercase text-white/30 mb-0.5">
          {subtitle ?? 'Dossier'}
        </div>
        <div className="text-sm font-medium text-white/85 truncate">{title}</div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </motion.div>
  )
}
