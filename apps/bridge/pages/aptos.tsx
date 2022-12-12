import { useEffect, useState } from 'react'
import Script from 'next/script'
import styled, { useTheme } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS } from 'components/layerZero/config'
import { LayerZeroWidget } from 'components/layerZero/LayerZeroWidget'
import AptosBridgeMessage from 'components/layerZero/AptosBridgeMessage'
import AptosBridgeFooter from 'components/layerZero/AptosBridgeFooter'

const Page = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  min-height: calc(100% - 56px);
  align-items: center;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.gradientBubblegum};

  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    place-content: center;
  }
`

const AptosBridge = () => {
  const theme = useTheme()
  const [show, setShow] = useState(false)

  useEffect(() => {
    customElements.whenDefined('aptos-bridge').then(() => {
      window.aptosBridge.config.setTokens(['CAKE', 'ETH', 'WETH', 'USDC', 'USDT'])
      window.aptosBridge.config.setWallets(['MetaMask', 'CoinBase', 'Petra', 'Martian', 'Pontem', 'Fewcha'])
      setShow(true)
    })
  }, [])

  return (
    <Page>
      <Script crossOrigin="anonymous" src={LAYER_ZERO_JS.src} integrity={LAYER_ZERO_JS.integrity} />
      <link rel="stylesheet" href="https://unpkg.com/@layerzerolabs/aptos-bridge-widget@latest/element.css" />
      {show && (
        <>
          <Box display={['none', null, 'block']}>
            <AptosBridgeMessage />
          </Box>
          <Flex
            flexDirection="column"
            width={['100%', null, '420px']}
            bg="backgroundAlt"
            borderRadius={[0, null, 24]}
            alignItems="center"
            height="100%"
          >
            <Box display={['block', null, 'none']}>
              <AptosBridgeMessage />
            </Box>
            <LayerZeroWidget theme={theme} />
            <Box display={['block', null, 'none']}>
              <AptosBridgeFooter />
            </Box>
          </Flex>
          <Box display={['none', null, 'block']}>
            <AptosBridgeFooter />
          </Box>
        </>
      )}
    </Page>
  )
}

export default AptosBridge
