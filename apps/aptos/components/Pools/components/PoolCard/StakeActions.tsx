import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import StakeModal from './StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
