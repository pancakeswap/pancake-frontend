import { Pool } from '@pancakeswap/uikit'
import { useCallback } from 'react'

import { Coin, ChainId } from '@pancakeswap/aptos-swap-sdk'

import { CAKE_PID } from 'components/Pools/constants'
import useUnstakeFarms from 'components/Farms/hooks/useUnstakeFarms'
import useStakeFarms from 'components/Farms/hooks/useStakeFarms'
import { useQueryClient } from '@pancakeswap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { FARMS_NAME_TAG, FARMS_USER_INFO } from 'state/farms/constants'
import StakeModalContainer from './StakeModalContainer'

const CakeStakeModal = ({ pool, ...rest }: Pool.StakeModalPropsType<Coin>) => {
  const { contractAddress } = pool
  const queryClient = useQueryClient()
  const { account, networkName } = useActiveWeb3React()

  const { onUnstake } = useUnstakeFarms(CAKE_PID, contractAddress[ChainId.TESTNET])
  const { onStake } = useStakeFarms(CAKE_PID, contractAddress[ChainId.TESTNET])

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const queryObject = query.queryKey[0]

        const isMasterchefQuery =
          queryObject?.entity === 'accountResource' && queryObject?.resourceType === FARMS_NAME_TAG

        const isPoolUserInfoHandleQuery =
          queryObject?.entity === 'tableItem' && queryObject?.data?.valueType === FARMS_USER_INFO

        return isMasterchefQuery || isPoolUserInfoHandleQuery
      },
    })
    queryClient.invalidateQueries({
      queryKey: [{ entity: 'accountResources', networkName, address: account }],
    })
  }, [account, networkName, queryClient])

  return <StakeModalContainer {...rest} onDone={onDone} onUnstake={onUnstake} onStake={onStake} pool={pool} />
}

export default CakeStakeModal
