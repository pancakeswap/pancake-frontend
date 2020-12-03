import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { QuoteToken } from 'sushi/lib/constants/types'
import { getFarms, getTotalLPWethValue } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

export interface StakedValue {
  tokenSymbol: string
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPrice: BigNumber
  poolWeight: BigNumber
  quoteToken: QuoteToken
  tokenDecimals: string
}

interface Farm {
  pid: number
  tokenSymbol: string
  lpContract: Contract
  tokenContract: Contract
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const block = useBlock()

  useEffect(() => {
    const fetchAllStakedValue = async () => {
      const res: Array<StakedValue> = await Promise.all(
        farms.map((farm: Farm) => {
          const { pid, tokenSymbol, lpContract, tokenContract } = farm
          return getTotalLPWethValue(sushi, lpContract, tokenContract, pid, tokenSymbol)
        }),
      )
      setBalance(res)
    }

    if (account && sushi) {
      fetchAllStakedValue()
    }
  }, [account, block, farms, setBalance, sushi])

  return balances
}

export default useAllStakedValue
