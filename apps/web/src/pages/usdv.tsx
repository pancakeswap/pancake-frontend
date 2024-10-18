import { ChainId } from '@pancakeswap/chains'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { ClientOnly, CurrencyLogo, PoweredBy } from '@pancakeswap/widgets-internal'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import DisclaimerModal from 'components/DisclaimerModal'

const usdvDisclaimer = atomWithStorage('pcs:usdv-disclaimer-accept', false, undefined, { unstable_getOnInit: true })

let initialized = false

// default to bsc
const DEFAULT_CHAIN_ID = 102
const USDV = {
  chainId: ChainId.BSC,
  symbol: 'USDV',
  isToken: true,
}

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

function useUSDVDisclaimer() {
  const { t } = useTranslation()
  const [accepted, setAccepted] = useAtom(usdvDisclaimer)
  const onAccept = useCallback(() => setAccepted(true), [setAccepted])
  const checks = useMemo(
    () => [
      {
        key: 'accept-risk',
        content: t(
          'By checking this box, I understand that I am using USDV at my own risk. I accept full responsibility for any losses incurred due to my actions.',
        ),
      },
    ],
    [t],
  )
  const [showModal] = useModal(
    <DisclaimerModal
      modalHeader={t('USDV Disclaimer')}
      id="usdv-disclaimer-modal"
      header={t('This is an experimental product')}
      subtitle={t('Verified USD ($USDV), is a product offered by USDV.money and is not associated with PancakeSwap.')}
      checks={checks}
      onSuccess={onAccept}
    />,
    false,
    true,
    'usdv-disclaimer-modal',
  )

  useEffect(() => {
    if (!accepted) {
      showModal()
    }
  }, [showModal, accepted])
}

function Widget() {
  const theme = useTheme()
  const { isMobile } = useMatchBreakpoints()
  useUSDVDisclaimer()

  useEffect(() => {
    init(theme)
  }, [theme])

  return (
    <Container>
      <usdv-widget
        style={{
          marginTop: isMobile ? 0 : '3rem',
          padding: isMobile ? 0 : '20px',
          maxWidth: isMobile ? '100%' : 'unset',
        }}
      />
      <PoweredBy href="https://usdv.money" suffix={<CurrencyLogo currency={USDV} size="1.375rem" />}>
        USDV.money
      </PoweredBy>
    </Container>
  )
}

const USDVPage = () => {
  return (
    <ClientOnly>
      <Widget />
    </ClientOnly>
  )
}

USDVPage.chains = [] as any

export default USDVPage
