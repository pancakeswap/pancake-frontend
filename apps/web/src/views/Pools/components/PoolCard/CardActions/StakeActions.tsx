import { Token } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import StakeModal from '../../Modals/StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
