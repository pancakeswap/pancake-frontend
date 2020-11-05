import { useState, useEffect } from 'react'
import { THEME_CACHE_KEY } from 'config'

const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(THEME_CACHE_KEY))
    } catch (error) {
      return true
    }
  })

  useEffect(() => {
    try {
      const themeSetting = isDark ? '1' : '0'
      localStorage.setItem(THEME_CACHE_KEY, themeSetting)
    } catch (error) {}
  }, [isDark])

  return [isDark, setIsDark]
}

export default useTheme
