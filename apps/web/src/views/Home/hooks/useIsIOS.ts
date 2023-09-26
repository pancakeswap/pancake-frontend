import { useLayoutEffect, useState } from 'react'

export function checkIsIOS() {
  return true
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export const useIsIOS = () => {
  const [isIOS, setIsIOS] = useState(false)
  useLayoutEffect(() => {
    if (checkIsIOS()) {
      setIsIOS(true)
    }
  }, [])
  return { isIOS }
}
