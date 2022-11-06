import { useCallback } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { useQueryClient } from '@pancakeswap/awgmi'
import { SMARTCHEF_ADDRESS } from 'contracts/smartchef/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import useHarvestPool from '../../hooks/useHarvestPool'
import CollectModalContainer from './CollectModalContainer'

export const CollectModal = ({
  sousId,
  stakingTokenAddress,
  earningTokenAddress,
  ...rest
}: React.PropsWithChildren<
  Pool.CollectModalProps & {
    earningTokenAddress: string
    stakingTokenAddress: string
  }
>) => {
  const queryClient = useQueryClient()
  const { account, networkName } = useActiveWeb3React()

  const { onReward } = useHarvestPool({ stakingTokenAddress, earningTokenAddress, sousId })

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [{ entity: 'accountResources', networkName, address: SMARTCHEF_ADDRESS }],
    })
    queryClient.invalidateQueries({
      queryKey: [{ entity: 'accountResources', networkName, address: account }],
    })
  }, [account, networkName, queryClient])

  return <CollectModalContainer {...rest} onDone={onDone} onReward={onReward} />
}

export default CollectModal
