import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../sushi/utils'
import useYam from './useYam'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const yam = useYam()
  const farms = getFarms(yam)
  const masterChefContract = getMasterChefContract(yam)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(masterChefContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, masterChefContract, yam])

  useEffect(() => {
    if (account && masterChefContract && yam) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, yam])

  return balances
}

export default useAllEarnings
