import { CHAIN_IDS } from 'utils/wagmi'

import { SwapFeaturesProvider } from 'views/Swap/SwapFeaturesContext'
import Swap from '../views/Swap'

const SwapPage = () => {
  return (
    <SwapFeaturesProvider>
      <Swap />
    </SwapFeaturesProvider>
  )
}

SwapPage.chains = CHAIN_IDS
SwapPage.screen = true

export default SwapPage
