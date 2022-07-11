import useTheme from 'hooks/useTheme'
import Script from 'next/script'
import { useEffect } from 'react'
import Page from 'views/Page'
import { STARGATE_CDN_URL, StargateWidget } from '@pancakeswap/stargate'
import { Box } from '@pancakeswap/uikit'

function Test() {
  const { isDark } = useTheme()
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
      <Script src={STARGATE_CDN_URL} />
      <Box width={['100%', , '420px']}>
        <StargateWidget theme={isDark ? 'dark' : 'light'} />
      </Box>
    </Page>
  )
}

export default Test
