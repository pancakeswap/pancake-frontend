import { useEffect } from 'react'
import { useTheme } from '@pancakeswap/hooks'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'

let initialized = false

// default to bsc
const DEFAULT_CHAIN_ID = 102

async function init(theme: ReturnType<typeof useTheme>) {
  if (initialized) {
    return
  }
  initialized = true
  const { bootstrapWidget, themes, mintStore } = await import('@usdv/usdv-widget')
  const originalGetCurrencies = mintStore.getDstCurrencies.bind(mintStore)
  mintStore.getDstCurrencies = async (...args: any[]) => {
    const currencies = await originalGetCurrencies(...args)
    return currencies.sort((a, b) => {
      if (a.chainId === DEFAULT_CHAIN_ID) return -1
      if (b.chainId === DEFAULT_CHAIN_ID) return 1
      return 0
    })
  }
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
