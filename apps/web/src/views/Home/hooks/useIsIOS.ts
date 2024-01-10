import { useState } from 'react'
import { useIsomorphicEffect } from '@pancakeswap/uikit'

export function checkIsIOS() {
  if (typeof window !== 'undefined') {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document) ||
      isSafari
    )
  }
  return false
}

export const useIsIOS = () => {
  const [isIOS, setIsIOS] = useState(false)
  useIsomorphicEffect(() => {
    if (checkIsIOS()) {
      setIsIOS(true)
    }
  }, [])
  return { isIOS }
}
