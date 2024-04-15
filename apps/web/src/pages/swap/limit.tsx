import dynamic from 'next/dynamic'
import { CHAIN_IDS } from 'utils/wagmi'
import SwapLayout from 'views/Swap/SwapLayout'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

const TwapAndLimitSwap = dynamic(() => import('views/Swap/Twap/TwapSwap'), { ssr: false })

const LimitPage = () => (
  <SwapLayout>
    <TwapAndLimitSwap limit />
    <V3SubgraphHealthIndicator />
  </SwapLayout>
)

LimitPage.chains = CHAIN_IDS
LimitPage.screen = true

export default LimitPage
