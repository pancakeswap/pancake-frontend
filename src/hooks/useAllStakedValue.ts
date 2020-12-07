import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'sushi/lib/constants/types'
import farmsConfig from 'sushi/lib/constants/farms'
import { getLPValues } from 'sushi/utils'

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

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)

  useEffect(() => {
    const fetchAllStakedValue = async () => {
      const res: Array<StakedValue> = await Promise.all(
        farmsConfig.map((farm) => {
          return getLPValues(
            farm.pid,
            farm.tokenSymbol,
            farm.lpAddresses[56],
            farm.tokenAddresses[56],
            farm.quoteTokenAdresses[56],
            farm.quoteTokenSymbol,
          )
        }),
      )

      setBalance(res)
    }

    fetchAllStakedValue()
  }, [])

  return balances
}

export default useAllStakedValue
