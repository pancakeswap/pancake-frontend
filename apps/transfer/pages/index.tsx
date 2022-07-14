import Script from 'next/script'
import * as React from 'react'
import styled, { useTheme } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { STARGATE_JS, StargateWidget } from '../components/stargate'

const Page = styled.div``

declare global {
  interface Window {
    // Stargate custom element api
    root?: any
  }
}

function Transfer() {
  const theme = useTheme()

  React.useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      // setTimeout(() => {
      //   window.root.transfer.selectToChain(10002)
      // }, 600)
      console.info('stargate widget mount')
    })
  }, [])

  return (
    <Page>
      <Script crossOrigin="anonymous" src={STARGATE_JS.src} integrity={STARGATE_JS.integrity} />
      <Box width={['100%', null, '420px']}>
        <StargateWidget theme={theme} />
      </Box>
    </Page>
  )
}

export default Transfer
