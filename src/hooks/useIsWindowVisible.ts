import { useEffect, useState } from 'react'

const VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document

function isWindowVisible() {
  if (!VISIBILITY_STATE_SUPPORTED) {
    return true
  }

  return document.visibilityState === 'visible'
}

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useIsWindowVisible() {
  const [isVisible, setIsVisible] = useState(isWindowVisible())

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return undefined

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
