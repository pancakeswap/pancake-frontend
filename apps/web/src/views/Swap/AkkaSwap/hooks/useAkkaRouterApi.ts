import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { FAST_INTERVAL } from 'config/constants'
import { useEffect, useState } from 'react'
import { useIsAkkaSwapModeStatus } from 'state/global/hooks'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import useSWR, { Fetcher } from 'swr'
import { AkkaRouterArgsResponseType, AkkaRouterInfoResponseType } from './types'
// simple function to create right parameter text for backend api using chain id
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
// Handshake api to test if backend in up ro down
export const useAkkaBitgertTokenlistHandshake = () => {
  const fetcher = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR('https://www.apiv2.akka.finance/tokens?chain=bitgert&limit=10', fetcher, {
    refreshInterval: 10000,
  })

  return { data, error }
}
// Api for smart contract args (use this api to call akka contract easily)
export const useAkkaRouterArgs = (token0: Currency, token1: Currency, amount: string, slippage: number = 0.1) => {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const fetcher: Fetcher<AkkaRouterArgsResponseType> = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(
    `https://www.apiv2.akka.finance/swap?token0=${inputCurrencyId === "BRISE" ? "0x0000000000000000000000000000000000000000" : token0?.wrapped?.address}&chain0=${setChainName(
      token0?.chainId,
    )}&token1=${outputCurrencyId === "BRISE" ? "0x0000000000000000000000000000000000000000" : token1?.wrapped?.address}&chain1=${setChainName(
      token1?.chainId,
    )}&amount=${amount}&slipage=${slippage}&use_split=true&exchanges=icecreamswap`,
    fetcher,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return { data, error }
}
// Api with information for ui to show route
export const useAkkaRouterRoute = (token0: Currency, token1: Currency, amount: string, slippage: number = 0.1) => {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const fetcher: Fetcher<AkkaRouterInfoResponseType> = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(
    `https://www.apiv2.akka.finance/route?token0=${inputCurrencyId === "BRISE" ? "0x0000000000000000000000000000000000000000" : token0?.wrapped?.address}&chain0=${setChainName(
      token0?.chainId,
    )}&token1=${outputCurrencyId === "BRISE" ? "0x0000000000000000000000000000000000000000" : token1?.wrapped?.address}&chain1=${setChainName(
      token1?.chainId,
    )}&amount=${amount}&slipage=${slippage}&use_split=true&exchanges=icecreamswap`,
    fetcher,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return { data, error }
}
// Call both apis route and args together in the same time
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
