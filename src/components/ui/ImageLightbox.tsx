import { useState, useEffect, useCallback } from 'react'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export function ImageLightbox({ images, initialIndex = 0, onClose }: ImageLightboxProps) {
  const [current, setCurrent] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)

  const prev = useCallback(
    () => setCurrent((i) => (i > 0 ? i - 1 : images.length - 1)),
    [images.length],
  )
  const next = useCallback(
    () => setCurrent((i) => (i < images.length - 1 ? i + 1 : 0)),
    [images.length],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  return (
    <div
      className="lightbox-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        &times;
      </button>

      {images.length > 1 && (
        <button className="lightbox-nav lightbox-nav--prev" onClick={prev} aria-label="Previous image">
          ‹
        </button>
      )}

      <div
        className={`lightbox-img-wrap${zoomed ? ' zoomed' : ''}`}
        onClick={() => setZoomed((z) => !z)}
        title={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
      >
        <img src={images[current]} alt={`Image ${current + 1}`} />
      </div>

      {images.length > 1 && (
        <button className="lightbox-nav lightbox-nav--next" onClick={next} aria-label="Next image">
          ›
        </button>
      )}

      {images.length > 1 && (
        <div className="lightbox-counter">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
