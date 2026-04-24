import { useEffect } from 'react'
import { useFileStore } from '../store/fileStore'

export function useBootstrap() {
  const init = useFileStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])
}
