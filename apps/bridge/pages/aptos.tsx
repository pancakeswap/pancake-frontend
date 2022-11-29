import { useEffect, useState } from 'react'
import Script from 'next/script'
import styled, { useTheme } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS } from 'components/layerZero/config'
import { LayerZeroWidget } from 'components/layerZero/LayerZeroWidget'
import PoweredBy from 'components/layerZero/PoweredBy'
import BigNumber from 'bignumber.js'

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
  const [inputAmount, setInputAmount] = useState(0)
  const [dailyLimitAmount, setDailyLimitAmount] = useState('1')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    customElements.whenDefined('aptos-bridge').then(() => {
      setShow(true)
    })
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.aptosBridge) {
        const { evm, aptos } = window.aptosBridge.wallet
        const connected = !!evm?.account && !!aptos?.account
        setIsConnected(connected)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (show) {
      const container = document.getElementsByClassName('css-5vb4lz')[0]
      container.innerHTML += `
        <div class="css-tbzvrn" bis_skin_checked="1">
          <div class="css-a70tuk css-1gvi1ws" bis_skin_checked="1">Daily limit</div>
          <div class="css-1pqgq7d css-10ikypg daily-limit-amount" bis_skin_checked="1">0</div>
        </div>
      `

      const inputDom = (document as any).querySelectorAll('.css-8fvar7')[0].querySelectorAll('input')[0]
      if (inputDom) {
        inputDom.addEventListener('input', updateValue)
      }
    }
  }, [show])

  useEffect(() => {
    const container = document.getElementsByClassName('daily-limit-amount') as HTMLCollectionOf<HTMLElement>
    if (show && container[0]) {
      const limit = dailyLimitAmount || '--'
      container[0].innerText = limit
    }
  }, [show, dailyLimitAmount])

  useEffect(() => {
    const inputAmountAsBn = new BigNumber(inputAmount)
    const dailyLimitAmountAsBn = new BigNumber(dailyLimitAmount)
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
  }, [show, inputAmount, dailyLimitAmount, isConnected])

  const updateValue = (e: any) => {
    const amount = new BigNumber(e.target.value)
    const amountDisplay = amount.isNaN() ? 0 : amount.toNumber()
    setInputAmount(amountDisplay)
  }

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
