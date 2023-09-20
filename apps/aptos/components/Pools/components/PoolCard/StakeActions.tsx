import { Token } from '@pancakeswap/swap-sdk-core'
import { Pool } from '@pancakeswap/widgets-internal'
import StakeModal from './StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
