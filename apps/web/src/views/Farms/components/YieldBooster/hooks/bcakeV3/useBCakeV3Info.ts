import { useCallback } from 'react'

import { BOOSTED_FARM_GAS_LIMIT } from 'config' // TODO: check v3 BCake gas limit with Chef Snoopy later
import { useBCakeFarmBoosterV3Contract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const SWR_SETTINGS_WITHOUT_REFETCH = {
  errorRetryCount: 3,
  errorRetryInterval: 3000,
  keepPreviousData: true,
}

export const useBakeV3Info = async (farmPid: number) => {
  const { chainId } = useActiveChainId()
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { data } = useSWRImmutable(
    chainId && farmPid && `v3/bcake/${chainId}/${farmPid}`,
    () => farmBoosterV3Contract.whiteList(farmPid),
    SWR_SETTINGS_WITHOUT_REFETCH,
  )
  return { farmCanBoost: data }
}

export const useBoosterFarmV3Handlers = (tokenId: string, onDone: () => void) => {
  const farmBoosterV3Contract = useBCakeFarmBoosterV3Contract()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const activate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterV3Contract, 'activate', [tokenId], { gasLimit: BOOSTED_FARM_GAS_LIMIT })
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [tokenId, farmBoosterV3Contract, callWithGasPrice, fetchWithCatchTxError, onDone])

  const deactivate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterV3Contract, 'deactive', [tokenId], { gasLimit: BOOSTED_FARM_GAS_LIMIT })
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [tokenId, farmBoosterV3Contract, callWithGasPrice, fetchWithCatchTxError, onDone])

  return { activate, deactivate, isConfirming }
}
