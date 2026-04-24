import { useEffect } from 'react'
import { useBootstrap } from '../../hooks/usePermissions'
import { useContextMenu } from '../../store/contextMenuStore'
import { AboutModal } from '../about/AboutModal'
import { ActiveDossier } from '../dossier/ActiveDossier'
import { IdentityPanel } from '../identity/IdentityPanel'
import { DossierLibrary } from '../library/DossierLibrary'
import { ContextMenu } from '../ui/ContextMenu'
import { TopBar } from './TopBar'
import { useUIStore } from '../../store/uiStore'

export function AppShell() {
  useBootstrap()
  const showAbout = useUIStore((s) => s.showAbout)
  const closeMenu = useContextMenu((s) => s.close)

  useEffect(() => {
    function suppress(e: MouseEvent) {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', suppress)
    return () => document.removeEventListener('contextmenu', suppress)
  }, [])

  return (
    <div
      className="relative flex flex-col h-screen select-none overflow-hidden"
      onClick={closeMenu}
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 15% 10%, rgba(10,28,60,0.7) 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 50% at 85% 80%, rgba(30,8,60,0.5) 0%, transparent 60%),' +
          'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(4,10,24,0.9) 0%, transparent 100%),' +
          '#07090f',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      <TopBar />

      <div
        className="relative flex-1 grid gap-3 px-4 pb-4 overflow-hidden"
        style={{ gridTemplateColumns: '280px 1fr 300px' }}
      >
        <DossierLibrary />
        <ActiveDossier />
        <IdentityPanel />
      </div>

      <ContextMenu />
      {showAbout && <AboutModal />}
    </div>
  )
}
