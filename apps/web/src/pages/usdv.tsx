import { useEffect } from 'react'
import { useTheme } from '@pancakeswap/hooks'

let initialized = false

async function init(theme: ReturnType<typeof useTheme>) {
  if (initialized) {
    return
  }
  initialized = true
  const { bootstrapWidget, themes } = await import('@usdv/usdv-widget')
  bootstrapWidget({ color: 1, theme: theme.isDark ? themes.dark : themes.light })
}

const USDVPage = () => {
  const theme = useTheme()

  useEffect(() => {
    init(theme)
  }, [theme])
  return <usdv-widget />
}

USDVPage.chains = [] as any

export default USDVPage
