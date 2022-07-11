import useTheme from 'hooks/useTheme'
import Script from 'next/script'
import { useEffect } from 'react'
import Page from 'views/Page'
import { STARGATE_JS, StargateWidget } from '@pancakeswap/stargate'
import { Box } from '@pancakeswap/uikit'

function Test() {
  const { theme } = useTheme()
  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      // setTimeout(() => {
      //   window.root.transfer.selectToChain(10002)
      // }, 600)
      console.info('stargate widget mount')
    })
  }, [])

  return (
    <Page hideFooter>
      <Script crossOrigin="anonymous" src={STARGATE_JS.src} integrity={STARGATE_JS.integrity} />
      <Box width={['100%', , '420px']}>
        <StargateWidget theme={theme} />
      </Box>
    </Page>
  )
}

export default Test
