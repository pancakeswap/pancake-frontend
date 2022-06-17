import { FC, useState } from 'react'
import Script from 'next/script'
import { listenOnBnMessage, useInterceptLink } from 'utils/mpBridge'
import { useActiveHandle, getAccount } from 'hooks/useEagerConnect.bmp'
import Farms, { FarmsContext } from './Farms'
import Navbar from './Navbar.bmp'

export const FarmsPageLayout: FC = ({ children }) => {
  return <Farms>{children}</Farms>
}

export const FarmsMpPageLayout: FC = ({ children }) => {
  const [sdkLoaded, setSdkLoaded] = useState(false)
  useInterceptLink()
  const handleActive = useActiveHandle()

  const handleLoad = async () => {
    setSdkLoaded(true)
    listenOnBnMessage()
    const account = await getAccount()
    if (account) {
      handleActive(false)
    }
  }

  return (
    <>
      <Script
        onLoad={handleLoad}
        src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js"
        id="mp-webview"
      />
      {sdkLoaded && <Navbar />}
      <Farms>{children}</Farms>
    </>
  )
}

export { FarmsContext }
