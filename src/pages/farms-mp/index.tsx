import Script from 'next/script'
import FarmsPage from '../farms'

const MpFarmsPage = () => {
  return (
    <>
      <Script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
      <FarmsPage />
    </>
  )
}

MpFarmsPage.Layout = FarmsPage.Layout
MpFarmsPage.mp = true

export default MpFarmsPage
