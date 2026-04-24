import { useEffect, useState } from 'react'

export function useClock(): string {
  const [time, setTime] = useState(() => fmt(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(fmt(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

function fmt(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
