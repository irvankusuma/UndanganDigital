import { useState, useEffect } from 'react'

export function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 })
        return
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])
  
  return time
}
