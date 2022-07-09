import { useContext, useEffect } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import Cookie from 'js.cookie'
import { COOKIE_THEME_KEY } from 'hooks/useTheme'

const useThemeCookie = () => {
  const theme = useContext(StyledThemeContext)

  useEffect(() => {
    const getThemeCookie = Cookie.get(COOKIE_THEME_KEY)

    if (!getThemeCookie) {
      const themeValue = theme.isDark ? 'dark' : 'light'
      Cookie.set(COOKIE_THEME_KEY, themeValue)
    }
  }, [theme])
}

export default useThemeCookie
