import { FC } from 'react'
import Script from 'next/script'
import Farms, { FarmsContext } from './Farms'

export const FarmsPageLayout: FC = ({ children }) => {
  return <Farms>{children}</Farms>
}

export const FarmsMpPageLayout: FC = ({ children }) => {
  return (
    <>
      <Script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
      <Farms>{children}</Farms>
    </>
  )
}

export { FarmsContext }
