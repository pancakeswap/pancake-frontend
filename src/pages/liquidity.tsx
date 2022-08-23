import { CHAIN_IDS } from '@pancakeswap/wagmi/chains'
import Liquidity from '../views/Pool'

const LiquidityPage = () => <Liquidity />

LiquidityPage.chains = CHAIN_IDS

export default LiquidityPage
