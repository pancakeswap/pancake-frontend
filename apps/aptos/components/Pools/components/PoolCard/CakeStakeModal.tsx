import { Pool } from '@pancakeswap/widgets-internal'
import { useCallback } from 'react'

import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { useQueryClient } from '@tanstack/react-query'
import useStakeFarms from 'components/Farms/hooks/useStakeFarms'
import useUnstakeFarms from 'components/Farms/hooks/useUnstakeFarms'
import cakePoolRelatedQueries from 'components/Pools/utils/cakePoolRelatedQueries'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import StakeModalContainer from './StakeModalContainer'

const CakeStakeModal = ({ pool, ...rest }: Pool.StakeModalPropsType<Coin>) => {
  const { contractAddress } = pool
  const queryClient = useQueryClient()
  const { account, networkName } = useActiveWeb3React()

  const { onUnstake } = useUnstakeFarms(contractAddress[ChainId.TESTNET])
  const { onStake } = useStakeFarms(contractAddress[ChainId.TESTNET])

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: cakePoolRelatedQueries(account),
    })
    queryClient.invalidateQueries({
      queryKey: [{ entity: 'accountResources', networkName, address: account }],
    })
  }, [account, networkName, queryClient])

  return <StakeModalContainer {...rest} onDone={onDone} onUnstake={onUnstake} onStake={onStake} pool={pool} />
}

export default CakeStakeModal
