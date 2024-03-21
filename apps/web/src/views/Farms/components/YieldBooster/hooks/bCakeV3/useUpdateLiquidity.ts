import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useMasterchefV3 } from 'hooks/useContract'
import { useCallback } from 'react'

export const useUpdateLiquidity = (tokenId: string, onDone: () => void) => {
  const masterChefV3 = useMasterchefV3()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const updateLiquidity = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(masterChefV3, 'updateLiquidity', [BigInt(tokenId)], { gas: BOOSTED_FARM_V3_GAS_LIMIT })
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [tokenId, masterChefV3, callWithGasPrice, fetchWithCatchTxError, onDone])

  return { updateLiquidity, isConfirming }
}
