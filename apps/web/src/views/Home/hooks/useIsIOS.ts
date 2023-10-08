import { useLayoutEffect, useState } from 'react'

export function checkIsIOS() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document) ||
    isSafari
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
