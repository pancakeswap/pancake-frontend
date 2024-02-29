import { useEffect, useState } from 'react'
import Script from 'next/script'
import { styled, useTheme } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS, FEE_COLLECTOR, FEE_TENTH_BPS, PARTNER_ID } from 'components/layerZero/config'
import { LayerZeroWidget } from 'components/layerZero/LayerZeroWidget'
import AptosBridgeFooter from 'components/layerZero/AptosBridgeFooter'
import { PancakeSwapTheme } from './theme'

declare global {
  interface Window {
    app?: any
  }
}

const Page = styled(Box)`
  display: flex;
  height: calc(100vh - 56px);
  background: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.mediaQueries.sm} {
    min-height: 1000px;
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

const LayerZero = ({ isCake }: { isCake?: boolean }) => {
  const theme = useTheme()
  const [show, setShow] = useState(false)

  useEffect(() => {
    customElements.whenDefined('lz-bridge').then((Bridge: any) => {
      const { createBasicTheme, bootstrap, uiStore } = Bridge

      if (!Bridge.initialized) {
        bootstrap({
          stargate: {
            partner: {
              partnerId: PARTNER_ID,
              feeCollector: FEE_COLLECTOR,
              feeBps: FEE_TENTH_BPS,
            },
          },
        })

        const newTheme = {
          dark: createBasicTheme(PancakeSwapTheme.dark),
          light: createBasicTheme(PancakeSwapTheme.light),
        }
        uiStore.theme.setConfig(newTheme)
      }

      if (isCake) {
        setTimeout(async () => {
          const app: any = await customElements.whenDefined('lz-bridge')
          const length = app?.bridgeStore?.currencies?.length
          if (length !== null || length !== undefined) {
            const currencies = app?.bridgeStore?.currencies?.slice()
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            app!.bridgeStore!.currencies.length = 0
            app?.bridgeStore?.addCurrencies(currencies?.filter((i: any) => i.symbol.toLowerCase() === 'cake'))

            const srcCake = app?.bridgeStore?.currencies?.find(
              (i: any) => i.symbol.toUpperCase() === 'CAKE' && i.chainId === 102,
            )
            app?.bridgeStore?.setSrcCurrency(srcCake)
          }
        }, 800)
      }

      setShow(true)
    })
  }, [isCake])

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

export default LayerZero
