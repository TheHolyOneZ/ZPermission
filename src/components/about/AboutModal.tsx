import { invoke } from '@tauri-apps/api/core'

const openUrl = (url: string) => invoke('open_url', { url }).catch(console.error)
import { AnimatePresence, motion } from 'framer-motion'
import iconSrc from '../../assets/icon.png'
import { useUIStore } from '../../store/uiStore'

const FEATURES = [
  { label: 'POSIX chmod / stat', color: '#4a9eff' },
  { label: 'Unix ACL', color: '#4a9eff' },
  { label: 'Windows ACL (WIP)', color: '#64748b' },
  { label: 'Staged changes', color: '#4ade80' },
  { label: 'Octal editor', color: '#4a9eff' },
  { label: 'Symbolic notation', color: '#4a9eff' },
  { label: 'setUID / setGID', color: '#fb923c' },
  { label: 'Sticky bit', color: '#fb923c' },
  { label: 'System path guards', color: '#fbbf24' },
  { label: 'GPL-3.0 Open Source', color: '#4ade80' },
  { label: 'Local-first', color: '#a855f7' },
  { label: 'No telemetry', color: '#4ade80' },
  { label: 'Cross-platform', color: '#a855f7' },
]

const STACK = [
  { name: 'Rust', sub: '2021 edition' },
  { name: 'Tauri', sub: 'v2' },
  { name: 'React', sub: 'v18' },
  { name: 'TypeScript', sub: 'v5' },
  { name: 'Zustand', sub: 'v5' },
  { name: 'Framer Motion', sub: 'v11' },
  { name: 'Tailwind CSS', sub: 'v4' },
  { name: 'Vite', sub: 'v5' },
]

const SKILLS = ['Architecture', 'UI/UX Design', 'Rust', 'React', 'TypeScript']

const LINKS = [
  { label: 'Project Site', href: 'https://zsync.eu/zpermissions/', color: '#4a9eff' },
  { label: 'GitHub', href: 'https://github.com/TheHolyOneZ/ZPermission', color: '#4ade80' },
  { label: 'More Projects', href: 'https://zsync.eu', color: '#a855f7' },
]

function SectionHead({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-mono tracking-[0.28em] uppercase text-white/30 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
    </div>
  )
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium"
      style={{ background: `${color}18`, border: `1px solid ${color}32`, color }}
    >
      {label}
    </div>
  )
}

function TechBadge({ name, sub }: { name: string; sub: string }) {
  return (
    <div
      className="flex items-baseline gap-2 px-3 py-2 rounded-xl text-xs font-mono"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span className="text-white/80 font-semibold">{name}</span>
      <span className="text-white/22">{sub}</span>
    </div>
  )
}

function LinkBtn({ label, href, color }: { label: string; href: string; color: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => openUrl(href)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}28`,
        color,
        boxShadow: `0 0 0 0 ${color}00`,
        transition: 'box-shadow 0.2s',
      }}
      onHoverStart={(e) => {
        ;(e.target as HTMLElement).style.boxShadow = `0 0 18px ${color}28`
      }}
      onHoverEnd={(e) => {
        ;(e.target as HTMLElement).style.boxShadow = `0 0 0 0 ${color}00`
      }}
    >
      {label}
      <span className="opacity-50 text-sm">↗</span>
    </motion.button>
  )
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const rowVariant = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
}

export function AboutModal() {
  const { showAbout, closeAbout } = useUIStore()

  return (
    <AnimatePresence>
      {showAbout && (
        <motion.div
          key="about-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)' }}
          onClick={closeAbout}
        >
          <motion.div
            key="about-card"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full overflow-y-auto rounded-3xl"
            style={{
              maxWidth: 680,
              maxHeight: '88vh',
              background: 'rgba(10,12,18,0.97)',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(48px)',
              boxShadow:
                '0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.035) inset, 0 0 80px rgba(74,158,255,0.04) inset',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
              style={{
                background:
                  'linear-gradient(90deg, transparent 5%, #4a9eff70 35%, #a855f760 65%, transparent 95%)',
              }}
            />

            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at top, rgba(74,158,255,0.07) 0%, transparent 70%)',
              }}
            />

            <div
              className="absolute inset-0 rounded-3xl pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="relative p-8"
            >
              <button
                onClick={closeAbout}
                className="absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono text-white/30 hover:text-white/70 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                ✕
              </button>

              <motion.div variants={rowVariant} className="flex items-start gap-5 mb-9">
                <motion.img
                  src={iconSrc}
                  alt="ZPermissions"
                  className="w-16 h-16 rounded-2xl flex-shrink-0"
                  style={{ boxShadow: '0 8px 24px rgba(74,158,255,0.2)' }}
                  initial={{ scale: 0.75, rotate: -6, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 20 }}
                />
                <div className="pt-1">
                  <div className="text-xs font-mono tracking-[0.3em] uppercase text-white/28 mb-1.5">
                    Z Suite · v0.1.0
                  </div>
                  <div className="text-3xl font-bold font-mono text-white leading-none mb-1.5">
                    ZPermissions
                  </div>
                  <div className="text-sm font-mono text-white/35">
                    Permission management, reimagined.
                  </div>
                </div>
              </motion.div>

              <motion.div variants={rowVariant} className="mb-7">
                <SectionHead label="Mission Brief" />
                <div
                  className="rounded-2xl p-4 text-sm font-mono leading-relaxed space-y-2"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-white/55">
                    ZPermissions is a cross-platform desktop tool for managing file and folder permissions.
                    It unifies{' '}
                    <span className="text-[#4a9eff] font-semibold">Unix POSIX chmod / stat</span>{' '}
                    and{' '}
                    <span style={{ color: '#a855f7' }} className="font-semibold">Windows ACL</span>{' '}
                    behind a single, spatial interface — making permission management readable,
                    reversible, and safe.
                  </p>
                  <p className="text-white/35">
                    Changes are staged before being applied. Protected system paths are blocked.
                    No cloud. No telemetry. Fully local.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={rowVariant} className="mb-7">
                <SectionHead label="Capabilities" />
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map((f) => (
                    <Chip key={f.label} label={f.label} color={f.color} />
                  ))}
                </div>
              </motion.div>

              <motion.div variants={rowVariant} className="mb-7">
                <SectionHead label="Tech Stack" />
                <div className="flex flex-wrap gap-2">
                  {STACK.map((s) => (
                    <TechBadge key={s.name} name={s.name} sub={s.sub} />
                  ))}
                </div>
              </motion.div>

              <motion.div variants={rowVariant} className="mb-7">
                <SectionHead label="Author" />
                <div
                  className="relative rounded-2xl p-5 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(74,158,255,0.06) 0%, rgba(168,85,247,0.04) 100%)',
                    border: '1px solid rgba(74,158,255,0.16)',
                  }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse, rgba(74,158,255,0.1) 0%, transparent 70%)',
                    }}
                  />
                  <div className="relative flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold font-mono flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(74,158,255,0.2), rgba(168,85,247,0.2))',
                        border: '1px solid rgba(74,158,255,0.3)',
                        color: '#4a9eff',
                        boxShadow: '0 0 24px rgba(74,158,255,0.15)',
                      }}
                    >
                      Z
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold font-mono text-white/90 mb-0.5">
                        TheHolyOneZ
                      </div>
                      <div className="text-xs font-mono text-white/38 mb-2.5">
                        Design · Backend · Frontend
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {SKILLS.map((s) => (
                          <span
                            key={s}
                            className="text-xs font-mono px-2 py-0.5 rounded-md"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.09)',
                              color: 'rgba(255,255,255,0.4)',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.06, y: -1 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => openUrl('https://github.com/TheHolyOneZ')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold flex-shrink-0"
                      style={{
                        background: 'rgba(74,158,255,0.14)',
                        border: '1px solid rgba(74,158,255,0.3)',
                        color: '#4a9eff',
                        boxShadow: '0 0 16px rgba(74,158,255,0.12)',
                      }}
                    >
                      GitHub
                      <span className="opacity-55">↗</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={rowVariant} className="mb-7">
                <SectionHead label="Links" />
                <div className="flex flex-wrap gap-3">
                  {LINKS.map((l) => (
                    <LinkBtn key={l.label} label={l.label} href={l.href} color={l.color} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={rowVariant}
                className="flex items-center justify-between pt-5"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-xs font-mono text-white/18">
                  GPL-3.0 · Copyright © 2026 TheHolyOneZ
                </span>
                <span className="text-xs font-mono text-white/15">
                  Z Suite · Local-first · No telemetry
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
