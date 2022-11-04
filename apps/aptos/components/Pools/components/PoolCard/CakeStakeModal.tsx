import { Pool } from '@pancakeswap/uikit'

import { Coin, ChainId } from '@pancakeswap/aptos-swap-sdk'

import { CAKE_PID } from 'components/Pools/constants'
import useUnstakeFarms from 'components/Farms/hooks/useUnstakeFarms'
import useStakeFarms from 'components/Farms/hooks/useStakeFarms'
import StakeModalContainer from './StakeModalContainer'

const CakeStakeModal = ({ pool, ...rest }: Pool.StakeModalPropsType<Coin>) => {
  const { contractAddress } = pool

  const { onUnstake } = useUnstakeFarms(CAKE_PID, contractAddress[ChainId.TESTNET])
  const { onStake } = useStakeFarms(CAKE_PID, contractAddress[ChainId.TESTNET])

  return <StakeModalContainer onUnstake={onUnstake} onStake={onStake} pool={pool} {...rest} />
}

export default CakeStakeModal
