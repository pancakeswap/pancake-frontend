import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useEffect, useState } from 'react'
import { AkkaRouterRouteType } from './types'

export const useAkkaRouterRoute = (token0: any, token1: any, amount: any, slippage: number = 0.1) => {
  const [data, setData] = useState<AkkaRouterRouteType>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.apiv2.akka.finance/swap?token0=${token0.address}&chain0=bitgert&token1=${token1.address}&chain1=bitgert&amount=${amount}&slipage=${slippage}&use_split=true`,
        )
        const responseData = (await response.json()) as AkkaRouterRouteType

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData, token0, token1, amount])

  return data
}
