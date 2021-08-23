import { useEffect, useRef } from 'react'

const VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document

// Check if the tab is active in the user browser
export default function useIsWindowVisibleRef() {
  const isBrowserTabActiveRef = useRef(true)

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return undefined

    const onVisibilityChange = () => {
      isBrowserTabActiveRef.current = !document.hidden
    }

    window.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return isBrowserTabActiveRef
}
