import { useEffect, useState } from 'react'

function isWindowVisible() {
  if (!(typeof document !== 'undefined' && 'visibilityState' in document)) {
    return true
  }

  return document.visibilityState === 'visible'
}

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useIsWindowVisible() {
  const [isVisible, setIsVisible] = useState(() => isWindowVisible())

  useEffect(() => {
    if (!('visibilityState' in document)) return undefined

    const handleVisibilityChange = () => {
      setIsVisible(isWindowVisible())
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [setIsVisible])

  return isVisible
}
