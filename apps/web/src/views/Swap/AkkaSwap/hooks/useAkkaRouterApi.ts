import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { FAST_INTERVAL } from 'config/constants'
import { useEffect, useState } from 'react'
import { useIsAkkaSwapModeStatus } from 'state/global/hooks'
import useSWR, { Fetcher } from 'swr'
import { AkkaRouterArgsResponseType, AkkaRouterInfoResponseType } from './types'
const setChainName = (chainId) => {
  switch (chainId) {
    case 56:
      return 'bsc'
    case 250:
      return 'fantom'
    case 32520:
      return 'bitgert'
  }
}
export const useAkkaBitgertTokenlistHandshake = () => {
  // const [data, setData] = useState(null)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`https://www.apiv2.akka.finance/tokens?chain=bitgert&limit=1`)
  //       const responseData = await response.status
  //       setData(responseData)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchData()
  // }, [setData])
  const fetcher = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR('https://www.apiv2.akka.finance/tokens?chain=bitgert&limit=10', fetcher, {
    refreshInterval: 10000,
  })

  return { data, error }
}
export const useAkkaRouterArgs = (token0: Currency, token1: Currency, amount: string, slippage: number = 0.1) => {
  const fetcher: Fetcher<AkkaRouterArgsResponseType> = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(
    `https://www.apiv2.akka.finance/swap?token0=${token0?.wrapped?.address}&chain0=${setChainName(
      token0?.chainId,
    )}&token1=${token1?.wrapped?.address}&chain1=${setChainName(
      token1?.chainId,
    )}&amount=${amount}&slipage=${slippage}&use_split=true`,
    fetcher,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return { data, error }
}
export const useAkkaRouterRoute = (token0: Currency, token1: Currency, amount: string, slippage: number = 0.1) => {
  const fetcher: Fetcher<AkkaRouterInfoResponseType> = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(
    `https://www.apiv2.akka.finance/route?token0=${token0?.wrapped?.address}&chain0=${setChainName(
      token0?.chainId,
    )}&token1=${token1?.wrapped?.address}&chain1=${setChainName(
      token1?.chainId,
    )}&amount=${amount}&slipage=${slippage}&use_split=true`,
    fetcher,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return { data, error }
}
export const useAkkaRouterRouteWithArgs = (
  token0: Currency,
  token1: Currency,
  amount: string,
  slippage: number = 0.1,
) => {
  const route = useAkkaRouterRoute(token0, token1, amount, slippage)
  const args = useAkkaRouterArgs(token0, token1, amount, slippage)
  return {
    route,
    args,
  }
}
