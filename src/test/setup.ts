import '@testing-library/jest-dom'

// jsdom doesn't ship IntersectionObserver — provide a no-op stub
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
}
