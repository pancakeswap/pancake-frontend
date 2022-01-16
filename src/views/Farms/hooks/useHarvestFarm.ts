import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { TransactionReceipt } from '@ethersproject/abstract-provider/src.ts/index'

const useHarvestFarm = (farmPid: number) => {
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(
    async (
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      const tx = await harvestFarm(masterChefContract, farmPid)
      onTransactionSubmitted(tx)
      const receipt = await tx.wait()
      if (receipt.status) {
        onSuccess(receipt)
      } else {
        onError(receipt)
      }
    },
    [farmPid, masterChefContract],
  )

  return { onReward: handleHarvest }
}

export default useHarvestFarm
