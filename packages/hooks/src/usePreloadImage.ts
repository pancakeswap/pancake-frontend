import { useEffect } from 'react'

const preloadImageMap = new Map()

export const usePreloadImages = (imageSources: string[]) => {
  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const src of imageSources) {
      if (!preloadImageMap.has(src)) {
        preloadImageMap.set(src, true)
        const img = new Image()
        img.src = src
      }
    }
  }, [imageSources])
}
