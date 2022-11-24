import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { useEffect, useState } from 'react'
import { AkkaRouterArgsResponseType, AkkaRouterInfoResponseType } from './types'

export const useAkkaRouterArgs = (token0: Currency, token1: Currency, amount: string, slippage: number = 0.1) => {
  const [data, setData] = useState<AkkaRouterArgsResponseType>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.apiv2.akka.finance/swap?token0=${token0?.wrapped?.address}&chain0=bitgert&token1=${token1?.wrapped?.address}&chain1=bitgert&amount=${amount}&slipage=${slippage}&use_split=true`,
        )
        const responseData = (await response.json()) as AkkaRouterArgsResponseType

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    if (token0 && token1 && amount) {
      fetchData()
    }
  }, [setData, token0, token1, amount, slippage])

  return data
}
export const useAkkaRouterRoute = (token0: Currency, token1: Currency, amount: string, slippage: number = 0.1) => {
  const [data, setData] = useState<AkkaRouterInfoResponseType>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.apiv2.akka.finance/route?token0=${token0?.wrapped?.address}&chain0=bitgert&token1=${token1?.wrapped?.address}&chain1=bitgert&amount=${amount}&slipage=${slippage}&use_split=true`,
        )
        const responseData = (await response.json()) as AkkaRouterInfoResponseType

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }
    if (token0 && token1 && amount) {
      fetchData()
    }
  }, [setData, token0, token1, amount, slippage])

  return data
}
export const useAkkaRouterRouteWithArgs = (token0: Currency, token1: Currency, amount: string, slippage: number = 0.1) => {
  const route = useAkkaRouterRoute(token0, token1, amount, slippage)
  const args = useAkkaRouterArgs(token0, token1, amount, slippage)
  return {
    route,
    args
  }
}