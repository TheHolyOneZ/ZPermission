import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { usePermissionStore } from '../../store/permissionStore'
import { MatrixCell } from './MatrixCell'

const COLS = ['read', 'write', 'execute'] as const

function modeToSymbolic(mode: number): string {
  const r = (m: number) => (mode & m ? 'r' : '-')
  const w = (m: number) => (mode & m ? 'w' : '-')
  const ownerX = mode & 0o4000 ? (mode & 0o100 ? 's' : 'S') : mode & 0o100 ? 'x' : '-'
  const groupX = mode & 0o2000 ? (mode & 0o010 ? 's' : 'S') : mode & 0o010 ? 'x' : '-'
  const otherX = mode & 0o1000 ? (mode & 0o001 ? 't' : 'T') : mode & 0o001 ? 'x' : '-'
  return r(0o400) + w(0o200) + ownerX + r(0o040) + w(0o020) + groupX + r(0o004) + w(0o002) + otherX
}

const SPECIAL_BITS = [
  { mask: 0o4000, label: 'setUID', desc: 'Run as owner' },
  { mask: 0o2000, label: 'setGID', desc: 'Run as group' },
  { mask: 0o1000, label: 'Sticky', desc: 'Restrict delete' },
]

function SpecialBitChip({
  label,
  desc,
  active,
  onChange,
}: {
  label: string
  desc: string
  active: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onChange(!active)}
      title={desc}
      className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all text-xs font-mono"
      style={{
        background: active ? 'rgba(74,158,255,0.14)' : 'rgba(255,255,255,0.04)',
        border: active ? '1px solid rgba(74,158,255,0.38)' : '1px solid rgba(255,255,255,0.08)',
        color: active ? '#4a9eff' : 'rgba(255,255,255,0.3)',
        boxShadow: active ? '0 0 10px rgba(74,158,255,0.15)' : 'none',
      }}
    >
      <span className="font-semibold">{label}</span>
    </motion.button>
  )
}

function OctalInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [raw, setRaw] = useState<string | null>(null)
  const display = raw !== null ? raw : (value & 0o7777).toString(8)

  return (
    <input
      type="text"
      value={display}
      maxLength={4}
      onFocus={() => setRaw((value & 0o7777).toString(8))}
      onChange={(e) => {
        const v = e.target.value.replace(/[^0-7]/g, '')
        setRaw(v)
        if (v.length > 0) {
          const parsed = parseInt(v, 8)
          if (!isNaN(parsed)) onChange(parsed)
        }
      }}
      onBlur={() => setRaw(null)}
      className="text-center bg-transparent font-mono font-bold tabular-nums outline-none"
      style={{ color: '#4a9eff', fontSize: 26, letterSpacing: 3, width: 96 }}
    />
  )
}

function SymbolicDisplay({ mode }: { mode: number }) {
  const str = modeToSymbolic(mode)
  const colored = (ch: string, i: number) => {
    const colors: Record<string, string> = {
      r: '#4ade80', w: '#fb923c', x: '#a78bfa',
      s: '#f472b6', S: '#f472b6', t: '#f472b6', T: '#f472b6',
    }
    return (
      <span key={i} style={{ color: ch === '-' ? 'rgba(255,255,255,0.18)' : colors[ch] ?? '#fff' }}>
        {ch}
      </span>
    )
  }
  return (
    <div className="font-mono text-sm tracking-widest select-all" title="Symbolic notation (ls -la)">
      {str.split('').map(colored)}
    </div>
  )
}

export function PermissionMatrix() {
  const {
    currentData,
    stagedChanges,
    stagedSpecialBits,
    viewMode,
    stageChange,
    stageOctal,
    stageSpecialBit,
    effectiveMode,
  } = usePermissionStore()

  if (!currentData || !currentData.acl_entries.length) {
    return (
      <div className="flex items-center justify-center h-28 text-white/20 text-xs font-mono">
        select a file to inspect
      </div>
    )
  }

  const getStagedValue = (idx: number, field: typeof COLS[number]) => {
    const c = stagedChanges.find((s) => s.entryIndex === idx && s.field === field)
    return c ? c.value : null
  }

  const effMode = effectiveMode()
  const isUnix = currentData.platform === 'linux' || currentData.platform === 'macos'

  return (
    <AnimatePresence mode="wait">
      {viewMode === 'simple' ? (
        <motion.div
          key="simple"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="grid gap-2 mt-3"
            style={{ gridTemplateColumns: '76px repeat(3, 1fr)' }}
          >
            <div />
            {COLS.map((col) => (
              <div
                key={col}
                className="text-center text-xs font-mono text-white/30 pb-1 uppercase tracking-widest"
              >
                {col}
              </div>
            ))}
            {currentData.acl_entries.map((entry, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center text-xs font-mono text-white/50 truncate pr-1">
                  {entry.identity}
                </div>
                {COLS.map((col) => (
                  <MatrixCell
                    key={col}
                    active={entry[col]}
                    staged={getStagedValue(i, col)}
                    label={`${entry.identity} ${col}`}
                    onChange={(val) => stageChange({ entryIndex: i, field: col, value: val })}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="advanced"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="mt-2 space-y-3"
        >
          {isUnix && (
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between gap-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs font-mono text-white/30 uppercase tracking-widest">Octal</div>
                <OctalInput value={effMode} onChange={stageOctal} />
              </div>

              <div
                className="w-px self-stretch"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />

              <div className="flex flex-col items-center gap-1">
                <div className="text-xs font-mono text-white/30 uppercase tracking-widest">Symbolic</div>
                <SymbolicDisplay mode={effMode} />
              </div>
            </div>
          )}

          {isUnix && (
            <div
              className="rounded-xl px-3 py-2.5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">
                Special Bits
              </div>
              <div className="flex gap-2">
                {SPECIAL_BITS.map(({ mask, label, desc }) => {
                  const base =
                    stagedSpecialBits !== null
                      ? stagedSpecialBits
                      : (currentData.unix_mode ?? 0) & 0o7000
                  return (
                    <SpecialBitChip
                      key={mask}
                      label={label}
                      desc={desc}
                      active={(base & mask) !== 0}
                      onChange={(v) => stageSpecialBit(mask, v)}
                    />
                  )
                })}
              </div>
            </div>
          )}

          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="flex items-center text-xs font-mono text-white/30 px-3 py-1.5 uppercase tracking-widest gap-2"
              style={{
                background: 'rgba(255,255,255,0.025)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="flex-1">Identity</span>
              {COLS.map((c) => (
                <span key={c} className="w-12 text-center flex-shrink-0">{c}</span>
              ))}
            </div>

            {currentData.acl_entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={false}
                className="flex items-center px-3 py-2 gap-2"
                style={{
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-white/65 break-all leading-tight">
                    {entry.identity}
                  </div>
                  <div className="text-xs font-mono text-white/25 mt-0.5">{entry.identity_type}</div>
                </div>
                {COLS.map((col) => (
                  <div key={col} className="w-12 flex-shrink-0">
                    <MatrixCell
                      active={entry[col]}
                      staged={getStagedValue(i, col)}
                      label={`${entry.identity} ${col}`}
                      onChange={(val) => stageChange({ entryIndex: i, field: col, value: val })}
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
