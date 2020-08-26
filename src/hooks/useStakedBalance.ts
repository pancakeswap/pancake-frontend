import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getMasterChefContract } from '../sushi/utils'
import useYam from './useYam'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const yam = useYam()
  const masterChefContract = getMasterChefContract(yam)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(masterChefContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, yam])

  useEffect(() => {
    if (account && yam) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, yam])

  return balance
}

export default useStakedBalance
