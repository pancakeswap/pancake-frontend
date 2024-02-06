import { CHAIN_IDS } from 'utils/wagmi'

import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

import { SwapFeaturesProvider } from 'views/Swap/SwapFeaturesContext'
import Swap from '../views/Swap'

const SwapPage = () => {
  return (
    <SwapFeaturesProvider>
      <Swap />
      <V3SubgraphHealthIndicator />
    </SwapFeaturesProvider>
  )
}

SwapPage.chains = CHAIN_IDS
SwapPage.screen = true

export default SwapPage
