import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import useSushi from './useSushi'
import { soushHarvest, harvest, getMasterChefContract, getSousChefContract } from '../sushi/utils'

const useReward = (farmPid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    return txHash
  }, [account, farmPid, sushi])

  return { onReward: handleReward }
}

export const useAllReward = (farmPids: number[]) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleReward = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, sushi])

  return { onReward: handleReward }
}

export const useSousReward = (sousId) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)
  const masterChefContract = getMasterChefContract(sushi)

  const handleReward = useCallback(async () => {
    if (sousId === 0) {
      const txHash = await harvest(masterChefContract, 0, account)
      return txHash
    }
    const txHash = await soushHarvest(sousChefContract, account)
    return txHash
  }, [account, sousId, sushi])

  return { onReward: handleReward }
}

export default useReward
