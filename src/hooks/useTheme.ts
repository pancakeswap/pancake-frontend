import { useState, useCallback, useEffect } from 'react'
import mediaObserve from '../utils/mediaObserve'

type ReturnType = [boolean, (isDark: boolean) => void]

function useTheme(): ReturnType {
  const [isDark, setIsDark] = useState(false)
  const toogleTheme = useCallback(rs => {
    setIsDark(rs)
  }, [setIsDark])

  useEffect(() => {
    const unSubscribe = mediaObserve.subscribe(rs => {
      toogleTheme(rs.isDark)
    });

    return unSubscribe;
  }, [toogleTheme])

  return [isDark, toogleTheme]
}

export default useTheme