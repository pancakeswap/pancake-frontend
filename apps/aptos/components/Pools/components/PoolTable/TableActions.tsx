import { Pool } from '@pancakeswap/widgets-internal'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import CollectModal from '../PoolCard/CollectModal'
import StakeActions from '../PoolCard/StakeActions'

const StakeActionContainer = Pool.withStakeActionContainer(StakeActions, ConnectWalletButton)

export default Pool.withTableActions<Coin>(Pool.withCollectModalTableAction(CollectModal), StakeActionContainer)
