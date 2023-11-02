import { ChainId } from '@pancakeswap/chains'
import GaugesVoting from 'views/GaugesVoting'

const GaugesVotingPage = () => <GaugesVoting />

GaugesVotingPage.chains = [ChainId.BSC_TESTNET]

export default GaugesVotingPage
