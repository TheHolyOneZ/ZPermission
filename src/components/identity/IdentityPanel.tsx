import { DossierPanel } from '../layout/DossierPanel'
import { IdentityCard } from './IdentityCard'
import { AclEntryRow } from './AclEntry'
import { usePermissionStore } from '../../store/permissionStore'

function platformLabel(p: string): string {
  if (p === 'linux') return 'POSIX · Linux'
  if (p === 'macos') return 'POSIX · macOS'
  if (p === 'windows') return 'Windows ACL'
  return p
}

export function IdentityPanel() {
  const { currentData } = usePermissionStore()

  const isUnix =
    currentData?.platform === 'linux' || currentData?.platform === 'macos'
  const isWindows = currentData?.platform === 'windows'

  return (
    <DossierPanel title="Identities" subtitle="Identity Management" delay={0.18}>
      <div className="overflow-y-auto h-full py-2">
        {!currentData || !currentData.owner ? (
          <div className="text-center text-white/20 text-xs font-mono py-8">
            no file selected
          </div>
        ) : (
          <>
            <div className="px-3 pb-2 text-xs font-mono text-white/30 uppercase tracking-widest">
              Principal
            </div>

            <IdentityCard
              identity={currentData.owner}
              type="user"
              isOwner
              permissions={currentData.acl_entries[0]}
            />
            <IdentityCard
              identity={currentData.group}
              type="group"
              permissions={currentData.acl_entries[1]}
            />

            {isUnix && currentData.acl_entries[2] && (
              <IdentityCard
                identity="others"
                type="group"
                permissions={currentData.acl_entries[2]}
              />
            )}

            {isWindows && currentData.acl_entries.length > 1 && (
              <div className="mt-4">
                <div className="px-3 pb-2 text-xs font-mono text-white/30 uppercase tracking-widest">
                  ACL
                </div>
                {currentData.acl_entries.slice(1).map((entry, i) => (
                  <AclEntryRow key={i} entry={entry} index={i} />
                ))}
              </div>
            )}

            {currentData.platform && (
              <div className="mt-4 px-3">
                <div className="pb-2 text-xs font-mono text-white/30 uppercase tracking-widest">
                  Platform
                </div>
                <div
                  className="px-3 py-2.5 rounded-xl text-xs font-mono"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="text-white/30 mb-0.5">type</div>
                  <div className="text-white/65">{platformLabel(currentData.platform)}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DossierPanel>
  )
}
