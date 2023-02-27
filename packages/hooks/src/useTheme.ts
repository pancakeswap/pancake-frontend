import { useContext, useCallback, useMemo } from 'react'
import Cookie from 'js-cookie'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes'

export const COOKIE_THEME_KEY = 'theme'
export const THEME_DOMAIN = '.pancakeswap.finance'

const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme()
  const theme = useContext(StyledThemeContext)

  const handleSwitchTheme = useCallback(
    (themeValue: 'light' | 'dark') => {
      try {
        setTheme(themeValue)
        Cookie.set(COOKIE_THEME_KEY, themeValue, { domain: THEME_DOMAIN })
      } catch (err) {
        // ignore set cookie error for perp theme
      }
    },
    [setTheme],
  )

  return useMemo(
    () => ({ isDark: resolvedTheme === 'dark', theme, setTheme: handleSwitchTheme }),
    [theme, resolvedTheme, handleSwitchTheme],
  )
}

export default useTheme
