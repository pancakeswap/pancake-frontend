import { useEffect } from 'react'
import { useTheme } from '@pancakeswap/hooks'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'

let initialized = false

// default to bsc
const DEFAULT_CHAIN_ID = 102

async function init(theme: ReturnType<typeof useTheme>) {
  if (initialized) {
    return
  }
  initialized = true
  const { bootstrapWidget, themes, mintStore } = await import('@usdv/usdv-widget')
  // @ts-ignore
  const originalGetCurrencies = mintStore.getDstCurrencies.bind(mintStore)
  // @ts-ignore
  mintStore.getDstCurrencies = async (color: number) => {
    const currencies = await originalGetCurrencies(color)
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
        address: '0x8b929aDE5e6835038f3cE6156768646c5f413B9B',
        chainKey: 'bsc',
      },
    ],
  })
}

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  alignItems: 'center',
})`
  height: 100%;
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const USDVPage = () => {
  const theme = useTheme()
  const { isMobile } = useMatchBreakpoints()

  useEffect(() => {
    init(theme)
  }, [theme])

  return (
    <Container>
      <usdv-widget
        style={{
          marginTop: isMobile ? 0 : '3rem',
          padding: isMobile ? 0 : '20px',
          maxWidth: isMobile ? '100%' : '468px',
        }}
      />
    </Container>
  )
}

USDVPage.chains = [] as any

export default USDVPage
