import { Pool } from '@pancakeswap/uikit'

import { Coin } from '@pancakeswap/aptos-swap-sdk'

import useStakePool from '../../hooks/useStakePool'
import useUnstakePool from '../../hooks/useUnstakePool'
import StakeModalContainer from './StakeModalContainer'

const StakeModal = ({ pool, ...rest }: Pool.StakeModalPropsType<Coin>) => {
  const { sousId, earningToken, stakingToken } = pool

  const { onUnstake } = useUnstakePool({
    sousId,
    earningTokenAddress: earningToken?.address,
    stakingTokenAddress: stakingToken?.address,
    stakingTokenDecimals: stakingToken?.decimals,
  })
  const { onStake } = useStakePool({
    sousId,
    earningTokenAddress: earningToken?.address,
    stakingTokenAddress: stakingToken?.address,
    stakingTokenDecimals: stakingToken?.decimals,
  })

  return <StakeModalContainer onUnstake={onUnstake} onStake={onStake} pool={pool} {...rest} />
}

export default StakeModal
