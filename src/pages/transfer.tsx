import useTheme from 'hooks/useTheme'
import Script from 'next/script'
import { useEffect } from 'react'
import Page from 'views/Page'

function Test() {
  const { isDark } = useTheme()
  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      // setTimeout(() => {
      //   window.root.transfer.selectToChain(10002)
      // }, 600)
    })
  }, [])

  return (
    <Page hideFooterOnDesktop>
      <Script src="https://unpkg.com/@layerzerolabs/stargate-ui@latest/element.js" />
      <div style={{ width: 420 }}>
        {/* @ts-ignore */}
        <stargate-widget
          partnerId="105"
          feeCollector="0xc13b65f7c53Cd6db2EA205a4b574b4a0858720A6"
          theme={isDark ? 'dark' : 'light'}
          tenthBps={0.4}
        />
      </div>
    </Page>
  )
}

export default Test
