import { CHAIN_IDS } from '@pancakeswap/wagmi/chains'
import Swap from '../views/Swap'

const SwapPage = () => {
  return <Swap />
}

SwapPage.chains = CHAIN_IDS

export default SwapPage
