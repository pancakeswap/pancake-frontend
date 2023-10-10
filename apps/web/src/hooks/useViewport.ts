import { useCallback, useEffect, useState } from 'react'

export const useViewport = () => {
  const [width, setWidth] = useState(-1)

  const handleWindowResize = useCallback((): void => {
    setWidth(window.innerWidth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [handleWindowResize])

  return { width }
}
