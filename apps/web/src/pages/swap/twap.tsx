import dynamic from 'next/dynamic'
import { CHAIN_IDS } from 'utils/wagmi'
import SwapLayout from 'views/Swap/SwapLayout'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

const TwapAndLimitSwap = dynamic(() => import('views/Swap/Twap/TwapSwap'), { ssr: false })

const TwapPage = () => (
  <SwapLayout>
    <TwapAndLimitSwap />
    <V3SubgraphHealthIndicator />
  </SwapLayout>
)

TwapPage.chains = CHAIN_IDS
TwapPage.screen = true

export default TwapPage
