import { useEffect } from 'react'

export const useScrollTop = (top = 0, left = 0, behavior: 'auto' | 'smooth' = 'smooth') => {
  useEffect(() => {
    window.scrollTo({
      top,
      left,
      behavior,
    })
  }, [top, left, behavior])
}
