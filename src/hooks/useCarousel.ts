import { useState, useCallback } from 'react'

export function useCarousel(count: number, visible: number) {
  const [index, setIndex] = useState(0)
  const max = Math.max(0, count - visible)

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(max, i + 1)), [max])

  return { index, prev, next, atStart: index === 0, atEnd: index >= max }
}
