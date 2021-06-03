import { useEffect, useRef } from 'react'

const useTabVisibility = () => {
  const tabVisibleRef = useRef(true)

  useEffect(() => {
    const onVisibilityChange = () => {
      tabVisibleRef.current = !document.hidden
    }

    window.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return { tabVisibleRef }
}

export default useTabVisibility
