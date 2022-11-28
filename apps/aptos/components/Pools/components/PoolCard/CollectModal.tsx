import { useCallback } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { useQueryClient } from '@pancakeswap/awgmi'
import { SMARTCHEF_ADDRESS } from 'contracts/smartchef/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import splitTypeTag from 'utils/splitTypeTag'

import useHarvestPool from '../../hooks/useHarvestPool'
import CollectModalContainer from './CollectModalContainer'

const CollectModal = ({ poolAddress = '', ...rest }: React.PropsWithChildren<Pool.CollectModalProps>) => {
  const queryClient = useQueryClient()
  const { account, networkName, chainId } = useActiveWeb3React()

  const [stakingTokenAddress, earningTokenAddress, sousId] = splitTypeTag(poolAddress[chainId])

  const onReward = useHarvestPool({ stakingTokenAddress, earningTokenAddress, sousId })

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
