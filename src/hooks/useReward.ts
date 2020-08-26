import { useCallback } from 'react'

import useYam from './useYam'
import { useWallet } from 'use-wallet'

import { harvest, getMasterChefContract } from '../sushi/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const yam = useYam()
  const masterChefContract = getMasterChefContract(yam)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterChefContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, yam])

  return { onReward: handleReward }
}

export default useReward
