import dynamic from 'next/dynamic'
import { CHAIN_IDS } from 'utils/wagmi'
import SwapLayout from 'views/Swap/SwapLayout'

const TwapAndLimitSwap = dynamic(() => import('views/Swap/Twap/TwapSwap'), { ssr: false })

const TwapPage = () => (
  <SwapLayout>
    <TwapAndLimitSwap />
  </SwapLayout>
)

TwapPage.chains = CHAIN_IDS
TwapPage.screen = true

export default TwapPage
