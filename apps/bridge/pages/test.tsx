import { useEffect, useState } from 'react'
import Script from 'next/script'
import styled, { useTheme } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS } from 'components/layerZero/config'
import AptosBridgeMessage from 'components/layerZero/AptosBridgeMessage'
import AptosBridgeFooter from 'components/layerZero/AptosBridgeFooter'
import { darkTheme, lightTheme } from 'components/layerZero/theme'

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
    customElements
      .whenDefined('lz-bridge')
      .then((Bridge: any) => {
        Bridge.bootstrap()
        setShow(true)
      })
      .catch((error) => console.log('lz-bridge Error: ', error))
  }, [])

  useEffect(() => {
    const themeText = theme.isDark ? 'dark' : 'light'
    const themeColor = theme.isDark ? darkTheme : lightTheme

    if (window.aptosBridge) {
      document.body.classList.add(themeText)
      document.querySelector('aptos-bridge').setTheme(themeColor)
    }

    return () => {
      document.body.classList.remove(themeText)
    }
  }, [theme])

  return (
    <Page>
      <Script type="module" src={LAYER_ZERO_JS.src} />
      <link rel="stylesheet" href="https://unpkg.com/@layerzerolabs/x-pancakeswap-widget@latest/element.css" />
      <style jsx global>{`
        .aptos-bridge-container > div {
          padding: 24px 16px !important;
          border-radius: 18px;
        }

        .css-twekd7,
        .css-iv85qm {
          margin-top: 32px !important;
        }

        .aptos-bridge-container > div > .MuiContainer-root {
          padding: 0 8px !important;
        }

        .dark [id^='radix-'] {
          background-color: #27262c;
        }

        .light [id^='radix-'] {
          background-color: #ffffff;
        }

        .css-11saint rect {
          fill: #d9d9d9;
        }

        .css-1ay9vb9 .css-9k6lzc-LzButton,
        .css-1ay9vb9 .css-1s9mcc4-LzButton {
          border: 1px solid #1fc7d4;
          border-radius: 8px;
          color: #1fc7d4;
          background: transparent;
        }

        .dark [data-radix-popper-content-wrapper] {
          background-color: #ffffff;
          border-radius: 18px;
        }
        .dark [data-radix-popper-content-wrapper] div {
          color: #280d5f;
        }
        .dark [data-radix-popper-content-wrapper] svg {
          fill: #ffffff;
        }

        .light [data-radix-popper-content-wrapper] {
          background-color: black;
          border-radius: 18px;
        }
        .light [data-radix-popper-content-wrapper] div {
          color: #ffffff;
        }
        .light [data-radix-popper-content-wrapper] svg {
          fill: black;
        }
      `}</style>
      {show && (
        <Box width={['100%', null, '420px']} m="auto">
          <Box mt="24px" display={['none', null, 'block']}>
            <AptosBridgeMessage />
          </Box>
          <Flex flexDirection="column" bg="backgroundAlt" borderRadius={[0, null, 24]} alignItems="center">
            <Box display={['block', null, 'none']}>
              <AptosBridgeMessage />
            </Box>
            <Box width="100%">
              <lz-tracker />
              <lz-bridge class="aptos-bridge-container" />
            </Box>
            <Box display={['block', null, 'none']}>
              <AptosBridgeFooter />
            </Box>
          </Flex>
          <Box display={['none', null, 'block']}>
            <AptosBridgeFooter />
          </Box>
        </Box>
      )}
    </Page>
  )
}

export default AptosBridge
