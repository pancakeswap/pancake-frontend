import { MpPageLayout } from 'components/MpPageLayout'
import Swap from 'views/Swap'
import { SwapFeaturesProvider } from 'views/Swap/SwapFeaturesContext'

const MpSwapPage = () => {
  return (
    <SwapFeaturesProvider>
      <Swap />
    </SwapFeaturesProvider>
  )
}

MpSwapPage.Layout = MpPageLayout
MpSwapPage.mp = true

export default MpSwapPage
