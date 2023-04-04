import { Token } from '@pancakeswap/swap-sdk-core'
import { Pool } from '@pancakeswap/uikit'
import StakeModal from './StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
