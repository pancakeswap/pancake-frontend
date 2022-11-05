import { useCallback } from 'react'
import { Pool } from '@pancakeswap/uikit'

import { Coin } from '@pancakeswap/aptos-swap-sdk'

import { useQueryClient } from '@pancakeswap/awgmi'
import { SMARTCHEF_ADDRESS } from 'contracts/smartchef/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import useStakePool from '../../hooks/useStakePool'
import useUnstakePool from '../../hooks/useUnstakePool'
import StakeModalContainer from './StakeModalContainer'

const StakeModal = ({ pool, ...rest }: Pool.StakeModalPropsType<Coin>) => {
  const { sousId, earningToken, stakingToken } = pool
  const queryClient = useQueryClient()
  const { account, networkName } = useActiveWeb3React()

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

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [{ entity: 'accountResources', networkName, address: SMARTCHEF_ADDRESS }],
    })
    queryClient.invalidateQueries({
      queryKey: [{ entity: 'accountResources', networkName, address: account }],
    })
  }, [account, networkName, queryClient])

  return <StakeModalContainer onDone={onDone} onUnstake={onUnstake} onStake={onStake} pool={pool} {...rest} />
}

export default StakeModal
