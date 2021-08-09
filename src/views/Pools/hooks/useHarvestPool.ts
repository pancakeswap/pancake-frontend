import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward } from 'state/actions'
import { harvestFarm } from 'utils/calls'
import { BIG_ZERO } from 'utils/bigNumber'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestPool = async (sousChefContract, gasPrice) => {
  const tx = await sousChefContract.deposit('0', { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

const harvestPoolBnb = async (sousChefContract, gasPrice) => {
  const tx = await sousChefContract.deposit({ ...options, value: BIG_ZERO, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

const useHarvestPool = (sousId, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      await harvestFarm(masterChefContract, 0, gasPrice)
    } else if (isUsingBnb) {
      await harvestPoolBnb(sousChefContract, gasPrice)
    } else {
      await harvestPool(sousChefContract, gasPrice)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestPool
