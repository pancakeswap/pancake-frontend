import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/launch-pools'

import Pools from 'views/LaunchPools'

const PoolsPage = () => <Pools />

PoolsPage.chains = SUPPORTED_CHAIN_IDS

export default PoolsPage
