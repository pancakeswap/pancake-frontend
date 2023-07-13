import { useEffect, useState } from 'react'
import Script from 'next/script'
import styled, { useTheme } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS } from 'components/layerZero/config'
import { LayerZeroWidget } from 'components/layerZero/LayerZeroWidget'
import AptosBridgeFooter from 'components/layerZero/AptosBridgeFooter'
import { FEE_COLLECTOR, FEE_TENTH_BPS, PARTNER_ID } from '../components/stargate/config'

const Page = styled(Box)`
  display: flex;
  height: 100%;
  height: calc(100vh - 56px);
  background: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.mediaQueries.sm} {
    min-height: 1000px;
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

const AptosBridge = () => {
  const theme = useTheme()
  const [show, setShow] = useState(false)

  useEffect(() => {
    customElements.whenDefined('lz-bridge').then(async (Bridge: any) => {
      const walletStoreWallets = (window as any)?.app?.walletStore?.wallets
      if (walletStoreWallets) {
        const wallets = Object?.fromEntries?.(
          Object?.entries?.(walletStoreWallets)?.filter?.(([key, wallet]) => (wallet as any)?.type !== 'WalletConnect'),
        )
        ;(window as any)?.app?.walletStore?.addWallets(wallets)
      }

      await Bridge.bootstrap({
        stargate: {
          partner: {
            partnerId: PARTNER_ID,
            feeCollector: FEE_COLLECTOR,
            feeBps: FEE_TENTH_BPS,
          },
        },
      })

      const currencies = (window as any)?.app?.bridgeStore?.currencies?.slice()
      ;(window as any)?.app?.bridgeStore?.currencies.length = 0
      ;(window as any)?.app?.bridgeStore?.addCurrencies(currencies?.filter((i) => i.symbol.toLowerCase() === 'cake'))

      setShow(true)
    })
  }, [])

  return (
    <Page>
      <Script type="module" crossOrigin="anonymous" src={LAYER_ZERO_JS.src} integrity={LAYER_ZERO_JS.integrity} />
      <link rel="stylesheet" href={`${LAYER_ZERO_JS.css}`} />
      {show && (
        <Box width={['100%', null, '420px']} m="auto">
          <Flex flexDirection="column" bg="backgroundAlt" borderRadius={[0, null, 24]} alignItems="center">
            <LayerZeroWidget theme={theme} />
            <Box display={['block', null, 'none']}>
              <AptosBridgeFooter isCake />
            </Box>
          </Flex>
          <Box display={['none', null, 'block']}>
            <AptosBridgeFooter isCake />
          </Box>
        </Box>
      )}
    </Page>
  )
}

export default AptosBridge
