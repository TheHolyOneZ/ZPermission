import { motion } from 'framer-motion'

interface Props {
  active: boolean
  staged: boolean | null
  label: string
  onChange: (value: boolean) => void
}

export function MatrixCell({ active, staged, label, onChange }: Props) {
  const effective = staged !== null ? staged : active
  const dirty = staged !== null && staged !== active

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      onClick={() => onChange(!effective)}
      title={label}
      className="relative flex items-center justify-center rounded-xl text-sm font-mono select-none w-full"
      style={{
        height: 40,
        minWidth: 40,
        background: effective ? 'rgba(74,158,255,0.16)' : 'rgba(255,255,255,0.04)',
        border: effective
          ? '1px solid rgba(74,158,255,0.42)'
          : '1px solid rgba(255,255,255,0.08)',
        color: effective ? '#4a9eff' : 'rgba(255,255,255,0.22)',
        boxShadow: effective ? '0 0 12px rgba(74,158,255,0.18)' : 'none',
        transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {effective ? '●' : '○'}
      {dirty && (
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: '#fbbf24' }}
        />
      )}
    </motion.button>
  )
}
