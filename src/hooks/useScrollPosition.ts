import { useState, useEffect } from 'react'

export function useScrollPosition(threshold = 400) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const handler = () => setPast(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])
  return past
}
