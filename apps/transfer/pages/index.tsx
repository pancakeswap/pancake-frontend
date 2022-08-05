import Script from 'next/script'
import { useEffect, useState } from 'react'
import Image from 'next/future/image'
import styled, { useTheme } from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { STARGATE_JS } from '../components/stargate/config'
import { StargateWidget } from '../components/stargate'

const Page = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

  const [show, setShow] = useState(false)

  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      setTimeout(() => {
        if (window.stargate) {
          window.stargate.setDstChainId(10002)
          window.stargate.setConfig({ dstChainIdList: [10002] })
        }
      }, 600)
      console.info('stargate widget mount')
      setShow(true)
    })
  }, [])

  return (
    <Page>
      <Script crossOrigin="anonymous" src={STARGATE_JS.src} integrity={STARGATE_JS.integrity} />
      <Flex
        flexDirection="column"
        width={['100%', null, '420px']}
        bg="backgroundAlt"
        borderRadius={[0, null, 24]}
        alignItems="center"
        height="100%"
      >
        <StargateWidget theme={theme} />
        {show && (
          <Box display={['block', null, 'none']}>
            <PoweredBy />
          </Box>
        )}
      </Flex>
      {show && (
        <Box display={['none', null, 'block']}>
          <PoweredBy />
        </Box>
      )}
    </Page>
  )
}

function PoweredBy() {
  const { isDark } = useTheme()
  return (
    <Flex mt="10px" alignItems="center" justifyContent="center">
      <Text small color="textSubtle" mr="8px">
        Powered By
      </Text>
      <Image
        width={78}
        height={20}
        src="/stargate.png"
        alt="Powered By Stargate"
        unoptimized
        style={{
          filter: isDark ? 'invert(1)' : 'unset',
        }}
      />
    </Flex>
  )
}

export default Transfer
