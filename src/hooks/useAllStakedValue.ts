import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'sushi/lib/constants/types'
import { getFarms, getLPValues } from '../sushi/utils'
import useSushi from './useSushi'

export interface StakedValue {
  tokenSymbol: string
  tokenAmount: BigNumber
  wbnbAmount: BigNumber
  totalWbnbValue: BigNumber
  tokenPrice: BigNumber
  poolWeight: BigNumber
  quoteToken: QuoteToken
  tokenDecimals: string
}

interface Farm {
  pid: number
  tokenSymbol: string
  tokenAddress: string
  lpTokenAddress: string
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const sushi = useSushi()
  const farms = getFarms(sushi)

  useEffect(() => {
    const fetchAllStakedValue = async () => {
      const res: Array<StakedValue> = await Promise.all(
        farms.map((farm: Farm) => {
          const { pid, tokenSymbol, tokenAddress, lpTokenAddress } = farm

          return getLPValues(pid, tokenSymbol, tokenAddress, lpTokenAddress)
        }),
      )
      setBalance(res)
    }

    fetchAllStakedValue()
  }, [farms])

  return balances
}

export default useAllStakedValue
