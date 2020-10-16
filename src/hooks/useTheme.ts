import { useState, useCallback, useEffect } from 'react'
import mediaObserve from '../utils/mediaObserve'

type ReturnType = [boolean, (isDark: boolean) => void]
const CACHE_KEY = 'IS_DARK'

function useTheme(): ReturnType {
  const [matchDarkMode, setMatchDarkMode] = useState(false)
  const [userDarkMode, setUserDarkMode] = useState(() => {
    let cache
    try {
      cache = JSON.parse(localStorage.getItem(CACHE_KEY))
    } catch(error){}
    return cache
  })
  const toogleTheme = useCallback(rs => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rs))
    } catch(error){}
    setUserDarkMode(rs)
  }, [setUserDarkMode])

  useEffect(() => {
    const unSubscribe = mediaObserve.subscribe(rs => {
      setMatchDarkMode(rs.isDark)
    });

    return unSubscribe;
  }, [setMatchDarkMode])

  const rtMode = userDarkMode === null ? matchDarkMode : userDarkMode

  return [rtMode, toogleTheme]
}

export default useTheme