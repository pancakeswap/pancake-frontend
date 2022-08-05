import { useContext, useEffect } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import Cookie from 'js-cookie'
import { COOKIE_THEME_KEY, THEME_DOMAIN } from 'hooks/useTheme'

const useThemeCookie = () => {
  const theme = useContext(StyledThemeContext)
  const themeValue = theme.isDark ? 'dark' : 'light'

  useEffect(() => {
    const getThemeCookie = Cookie.get(COOKIE_THEME_KEY, { domain: THEME_DOMAIN })

    if (!getThemeCookie && getThemeCookie !== themeValue) {
      Cookie.set(COOKIE_THEME_KEY, themeValue, { domain: THEME_DOMAIN })
    }
  }, [themeValue])
}

export default useThemeCookie
