import Script from 'next/script'
import FarmsHistoryPage from 'pages/farms/history'

const MPFarmsHistoryPage = () => {
  return (
    <>
      <Script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
      <FarmsHistoryPage />
    </>
  )
}

MPFarmsHistoryPage.Layout = FarmsHistoryPage.Layout
MPFarmsHistoryPage.mp = true

export default MPFarmsHistoryPage
