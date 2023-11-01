import { ChainId } from '@pancakeswap/chains'
import CakeStaking from 'views/CakeStaking'

const CakeStakingPage = () => <CakeStaking />

CakeStakingPage.chains = [ChainId.BSC_TESTNET]

export default CakeStakingPage
