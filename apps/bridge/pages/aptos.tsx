import { useEffect, useState } from 'react'
import Script from 'next/script'
import styled, { useTheme } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS } from 'components/layerZero/config'
import { LayerZeroWidget } from 'components/layerZero/LayerZeroWidget'
import PoweredBy from 'components/layerZero/PoweredBy'
import { AptosBridgeForm } from 'components/layerZero/types'

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
  const [limitAmount, setLimitAmount] = useState('0')
  const [aptosBridgeForm, setAptosBridgeForm] = useState<AptosBridgeForm>({
    srcCurrency: null,
    dstCurrency: null,
  })

  useEffect(() => {
    customElements.whenDefined('aptos-bridge').then(() => {
      window.aptosBridge.config.setTokens(['CAKE', 'ETH', 'WETH', 'USDC', 'USDT'])
      setShow(true)
    })
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.aptosBridge) {
        const { dstCurrency, srcCurrency } = window.aptosBridge.bridge.form
        const limitBridgeAmount = window.aptosBridge.bridge.limitAmount.toExact()

        setLimitAmount(limitBridgeAmount)
        setAptosBridgeForm({
          srcCurrency,
          dstCurrency,
        })
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (show) {
      const container = document.getElementsByClassName('css-5vb4lz')[0]
      const srcCurrencySymbol = aptosBridgeForm.srcCurrency?.symbol
      const dstCurrencySymbol = aptosBridgeForm.dstCurrency?.symbol

      if (container.children.length === 3 || srcCurrencySymbol !== 'CAKE' || dstCurrencySymbol !== 'CAKE') {
        container.children[2]?.remove()
      }

      if (
        container &&
        container.children.length === 2 &&
        (srcCurrencySymbol === 'CAKE' || dstCurrencySymbol === 'CAKE')
      ) {
        const limitAmountDom = document.createElement('div')
        limitAmountDom.innerHTML += `
          <div class="css-v2g2au" bis_skin_checked="1">
            <div class="css-a70tuk css-1gvi1ws" bis_skin_checked="1">Limit</div>
            <div class="css-1pqgq7d css-10ikypg daily-limit-amount" bis_skin_checked="1">0</div>
          </div>
        `
        container.append(limitAmountDom)
      }
    }
  }, [aptosBridgeForm.dstCurrency?.symbol, aptosBridgeForm.srcCurrency?.symbol, show, theme])

  useEffect(() => {
    const container = document.getElementsByClassName('daily-limit-amount') as HTMLCollectionOf<HTMLElement>
    if (show && container[0]) {
      const limit = Math.trunc(Number(limitAmount)).toString() || '--'
      container[0].innerText = limit
    }
  }, [show, limitAmount])

  return (
    <Page>
      <Script crossOrigin="anonymous" src={LAYER_ZERO_JS.src} integrity={LAYER_ZERO_JS.integrity} />
      <link rel="stylesheet" href="https://unpkg.com/@layerzerolabs/aptos-bridge-widget@latest/element.css" />
      {show && (
        <>
          <Flex
            flexDirection="column"
            width={['100%', null, '420px']}
            bg="backgroundAlt"
            borderRadius={[0, null, 24]}
            alignItems="center"
            height="100%"
          >
            <LayerZeroWidget theme={theme} />
            <Box display={['block', null, 'none']}>
              <PoweredBy />
            </Box>
          </Flex>
          <Box display={['none', null, 'block']}>
            <PoweredBy />
          </Box>
        </>
      )}
    </Page>
  )
}

export default AptosBridge
