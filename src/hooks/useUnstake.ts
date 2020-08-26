import { useCallback } from 'react'

import useYam from './useYam'
import { useWallet } from 'use-wallet'

import { unstake, getMasterChefContract } from '../sushi/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const yam = useYam()
  const masterChefContract = getMasterChefContract(yam)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, yam],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
