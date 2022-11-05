import { useQueryClient } from '@pancakeswap/awgmi'
import { Pool } from '@pancakeswap/uikit'
import useHarvestFarm from 'components/Farms/hooks/useHarvestFarm'
import { CAKE_PID } from 'components/Pools/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { FARMS_NAME_TAG, FARMS_USER_INFO } from 'state/farms/constants'
import CollectModalContainer from './CollectModalContainer'

const CakeCollectModal = ({
  earningTokenAddress,
  ...rest
}: React.PropsWithChildren<
  Pool.CollectModalProps & {
    earningTokenAddress: string
    stakingTokenAddress: string
  }
>) => {
  const { onReward } = useHarvestFarm(CAKE_PID, earningTokenAddress)
  const queryClient = useQueryClient()
  const { account, networkName } = useActiveWeb3React()

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

  return <CollectModalContainer onDone={onDone} onReward={onReward} {...rest} />
}

export default CakeCollectModal
