import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import useSushi from './useSushi'
import { soushHarvest, soushHarvestBnb, harvest, getMasterChefContract, getSousChefContract } from '../sushi/utils'

export const useHarvest = (farmPid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    return txHash
  }, [account, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)
  const masterChefContract = getMasterChefContract(sushi)

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      const txHash = await harvest(masterChefContract, 0, account)
      return txHash
    }
    if (isUsingBnb) {
      const txHash = await soushHarvestBnb(sousChefContract, account)
      return txHash
    }
    const txHash = await soushHarvest(sousChefContract, account)
    return txHash
  }, [account, isUsingBnb, masterChefContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}
