import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { getStaked, getMasterChefContract, getSousChefContract, getSousStaked } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useSousStakedBalance = (sousId) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    if (sousId === 0) {
      const res = await getStaked(masterChefContract, '0', account)
      setBalance(new BigNumber(res))
    } else {
      const res = await getSousStaked(sousChefContract, account)
      setBalance(new BigNumber(res))
    }
  }, [sousId, masterChefContract, account, sousChefContract])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
    }
  }, [account, setBalance, block, sushi, fetchBalance])

  return balance
}

export default useSousStakedBalance
