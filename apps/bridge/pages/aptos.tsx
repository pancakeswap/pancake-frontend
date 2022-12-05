import { useEffect, useState, useMemo } from 'react'
import Script from 'next/script'
import styled, { useTheme } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS } from 'components/layerZero/config'
import { LayerZeroWidget } from 'components/layerZero/LayerZeroWidget'
import PoweredBy from 'components/layerZero/PoweredBy'
import BigNumber from 'bignumber.js'
import useCakeDailyLimit from 'components/layerZero/hooks/useCakeDailyLimit'
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
  const [aptosBridgeForm, setAptosBridgeForm] = useState<AptosBridgeForm>({
    evmAddress: '',
    aptosAddress: '',
    inputAmount: '',
    srcCurrency: null,
    dstCurrency: null,
  })
  const { paused, isWhitelistAddress, limitAmount } = useCakeDailyLimit({ ...aptosBridgeForm })

  useEffect(() => {
    customElements.whenDefined('aptos-bridge').then(() => {
      setShow(true)
    })
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.aptosBridge) {
        const { evm, aptos } = window.aptosBridge.wallet
        const { amount, dstCurrency, srcCurrency } = window.aptosBridge.bridge.form

        setAptosBridgeForm({
          evmAddress: evm?.account,
          aptosAddress: aptos?.account,
          inputAmount: amount,
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
      container.innerHTML += `
        <div class="css-v2g2au" bis_skin_checked="1">
          <div class="css-a70tuk css-1gvi1ws" bis_skin_checked="1">Daily limit</div>
          <div class="css-1pqgq7d css-10ikypg daily-limit-amount" bis_skin_checked="1">0</div>
        </div>
      `
    }
  }, [show])

  const isConnected = useMemo(() => {
    return !!aptosBridgeForm.evmAddress && !!aptosBridgeForm.aptosAddress
  }, [aptosBridgeForm])

  useEffect(() => {
    const container = document.getElementsByClassName('daily-limit-amount') as HTMLCollectionOf<HTMLElement>
    if (show && container[0]) {
      const limit = isConnected && limitAmount ? limitAmount : '--'
      container[0].innerText = limit
    }
  }, [show, limitAmount, isConnected])

  useEffect(() => {
    const inputAmountAsBn = new BigNumber(aptosBridgeForm.inputAmount)
    const dailyLimitAmountAsBn = new BigNumber(limitAmount)
    const buttonDom = (document as any).querySelectorAll('.css-8fvar7')[0]?.querySelectorAll('button')[6]

    if (buttonDom) {
      setTimeout(() => {
        if (
          isConnected &&
          (buttonDom?.innerText.toLowerCase() === 'transfer' ||
            buttonDom?.innerText.toLowerCase() === 'checking fee ...')
        ) {
          buttonDom.disabled = inputAmountAsBn.gt(dailyLimitAmountAsBn)
        } else {
          buttonDom.disabled = false
        }
      }, 0)
    }
  }, [show, aptosBridgeForm, limitAmount, isConnected])

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
