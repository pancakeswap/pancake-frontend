import Script from 'next/script'
import { useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { STARGATE_JS } from '../components/stargate/config'
import { StargateWidget } from '../components/stargate'

const Page = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.gradients.bubblegum};

  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    place-content: center;
  }
`

declare global {
  interface Window {
    // Stargate custom element api
    stargate?: any
  }
}

function Transfer() {
  const theme = useTheme()

  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      setTimeout(() => {
        if (window.stargate) {
          window.stargate.setDstChainId(10002)
          window.stargate.setConfig({ dstChainIdList: [10002] })
        }
      }, 600)
      console.info('stargate widget mount')
    })
  }, [])

  return (
    <Page>
      <Script crossOrigin="anonymous" src={STARGATE_JS.src} integrity={STARGATE_JS.integrity} />
      <Flex
        width={['100%', null, '420px']}
        bg="backgroundAlt"
        borderRadius={[0, null, 24]}
        alignItems="center"
        height="100%"
      >
        <StargateWidget theme={theme} />
      </Flex>
    </Page>
  )
}

export default Transfer
