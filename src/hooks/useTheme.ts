import { useContext } from 'react'
import Cookie from 'js.cookie'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes'

const COOKIE_THEME_KEY = 'theme'

const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme()
  const theme = useContext(StyledThemeContext)
  const getThemeCookie = Cookie.get(COOKIE_THEME_KEY)

  if (!getThemeCookie) {
    const themeValue = theme.isDark ? 'dark' : 'light'
    Cookie.set(COOKIE_THEME_KEY, themeValue)
  }

  const handleSwitchTheme = (themeValue: 'light' | 'dark') => {
    setTheme(themeValue)
    Cookie.set(COOKIE_THEME_KEY, themeValue)
  }

  return { isDark: resolvedTheme === 'dark', theme, setTheme: handleSwitchTheme }
}

export default useTheme
