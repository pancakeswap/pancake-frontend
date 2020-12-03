import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { getEarned, getMasterChefContract, getFarms } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const res: Array<BigNumber> = await Promise.all(
        farms.map(({ pid }: { pid: number }) => {
          return getEarned(masterChefContract, pid, account)
        }),
      )
      setBalance(res)
    }

    if (account && masterChefContract && sushi) {
      fetchAllBalances()
    }
  }, [account, block, farms, masterChefContract, setBalance, sushi])

  return balances
}

export default useAllEarnings
