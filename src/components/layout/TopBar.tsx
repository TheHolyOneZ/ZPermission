import { getCurrentWindow } from '@tauri-apps/api/window'
import { useClock } from '../../hooks/useClock'
import { useUIStore } from '../../store/uiStore'
import iconSrc from '../../assets/icon.png'

const win = getCurrentWindow()

async function doClose() { try { await win.close() } catch { /* ignored */ } }
async function doMinimize() { try { await win.minimize() } catch { /* ignored */ } }
async function doMaximize() { try { await win.toggleMaximize() } catch { /* ignored */ } }

interface TrafficProps {
  color: string
  hoverIcon: string
  onClick: () => void
}

function TrafficLight({ color, hoverIcon, onClick }: TrafficProps) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className="group relative w-3.5 h-3.5 rounded-full flex items-center justify-center transition-opacity opacity-55 hover:opacity-100 flex-shrink-0"
      style={{ background: color }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center text-black/70 font-bold opacity-0 group-hover:opacity-100 transition-opacity select-none"
        style={{ fontSize: 8 }}
      >
        {hoverIcon}
      </span>
    </button>
  )
}

export function TopBar() {
  const time = useClock()
  const openAbout = useUIStore((s) => s.openAbout)

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button === 0) win.startDragging()
  }

  function handleDoubleClick() {
    doMaximize()
  }

  return (
    <div
      className="flex items-center justify-between px-5 py-3 flex-shrink-0 cursor-default"
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center gap-3 pointer-events-none select-none">
        <img
          src={iconSrc}
          alt="ZPermissions"
          className="w-7 h-7 rounded-lg object-contain"
          draggable={false}
        />
        <span className="text-white/65 text-sm font-mono tracking-wide">ZPermissions</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white/20 text-xs font-mono tabular-nums select-none pointer-events-none tracking-widest">
          {time}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); openAbout() }}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          title="About ZPermissions"
          className="flex items-center justify-center w-5 h-5 rounded-md text-white/25 hover:text-white/60 transition-colors font-mono text-xs"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          i
        </button>
        <div className="flex gap-1.5">
          <TrafficLight color="#ff5f57" hoverIcon="✕" onClick={doClose} />
          <TrafficLight color="#febc2e" hoverIcon="−" onClick={doMinimize} />
          <TrafficLight color="#28c840" hoverIcon="+" onClick={doMaximize} />
        </div>
      </div>
    </div>
  )
}
