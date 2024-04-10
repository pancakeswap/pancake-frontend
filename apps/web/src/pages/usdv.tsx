import { useEffect } from 'react'
import { useTheme } from '@pancakeswap/hooks'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'

let initialized = false

async function init(theme: ReturnType<typeof useTheme>) {
  if (initialized) {
    return
  }
  initialized = true
  const { bootstrapWidget, themes } = await import('@usdv/usdv-widget')
  bootstrapWidget({
    color: 20,
    theme: theme.isDark ? themes.dark : themes.light,
    bridgeRecolorConfig: [
      {
        address: '0x8b929ade5e6835038f3ce6156768646c5f413b9b',
        chainKey: 'bsc',
      },
    ],
  })
}

const USDVPage = () => {
  const theme = useTheme()
  const { isMobile } = useMatchBreakpoints()

  useEffect(() => {
    init(theme)
  }, [theme])

  return (
    <Flex flexDirection="column" alignItems="center">
      <usdv-widget
        style={{
          padding: isMobile ? 0 : '20px',
          maxWidth: isMobile ? '100%' : '468px',
        }}
      />
    </Flex>
  )
}

USDVPage.chains = [] as any

export default USDVPage
