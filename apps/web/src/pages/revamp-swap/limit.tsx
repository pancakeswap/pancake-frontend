import dynamic from 'next/dynamic'
import { CHAIN_IDS } from 'utils/wagmi'
import SwapLayout from 'views/Swap/SwapLayout'

const TwapAndLimitSwap = dynamic(() => import('views/Swap/Twap/TwapSwap'), { ssr: false })

const LimitPage = () => (
  <SwapLayout>
    <TwapAndLimitSwap limit />
  </SwapLayout>
)

LimitPage.chains = CHAIN_IDS
LimitPage.screen = true

export default LimitPage
