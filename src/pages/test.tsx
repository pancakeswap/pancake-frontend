import Script from 'next/script'
import { useEffect } from 'react'

function Test() {
  useEffect(() => {
    customElements.whenDefined('stargate-widget').then(() => {
      // setTimeout(() => {
      //   window.root.transfer.selectToChain(10002)
      // }, 600)
    })
  }, [])
  return (
    <>
      <Script src="https://unpkg.com/@layerzerolabs/stargate-ui@latest/element.js" />
      <div style={{}}>
        <stargate-widget theme="dark" />
      </div>
    </>
  )
}

export default Test
