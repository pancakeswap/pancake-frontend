/* eslint-disable no-param-reassign */
import { Coin, Currency, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN, useAccount, useAccountResources, useCoin, useCoins as useCoins_ } from '@pancakeswap/awgmi'
import { coinStoreResourcesFilter, wrapCoinStoreTypeTag } from '@pancakeswap/awgmi/core'
import { useAtomValue } from 'jotai'
import fromPairs from 'lodash/fromPairs'
import { useMemo } from 'react'
import { combinedTokenMapFromActiveUrlsAtom, TokenAddressMap } from 'state/lists/hooks'
import { useUserAddedTokens } from 'state/user'
import useNativeCurrency from './useNativeCurrency'
import { useActiveChainId, useActiveNetwork } from './useNetwork'

export function useCurrency(coinId?: string): Currency | undefined {
  const native = useNativeCurrency()
  const isNative = coinId === APTOS_COIN
  const token = useToken(isNative ? undefined : coinId)
  return useMemo(() => (isNative ? native : token.data), [native, token.data, isNative])
}

export function useToken(coinId?: string) {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()
  const tokens = useAllTokens()
  const token = coinId && tokens[coinId]

  return useCoin({
    coin: coinId,
    networkName,
    select: (d) => {
      const { decimals, symbol, name } = d
      if (token) return token
      if (!coinId) return undefined
      return new Coin(chainId, coinId, decimals, symbol, name)
    },
  })
}

// TODO: get token info useAllTokens first
export function useCoins(addresses: string[]) {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()

  return useCoins_({
    coins: addresses,
    networkName,
    select: (result) => {
      return new Coin(chainId, result.address, result.decimals, result.symbol, result.name)
    },
  })
}

const mapWithoutUrls = (tokenMap: TokenAddressMap, chainId: number) =>
  Object.keys(tokenMap[chainId] || {}).reduce<{ [address: string]: Token }>((newMap, address) => {
    newMap[address] = tokenMap[chainId][address].token
    return newMap
  }, {})

export function useAllTokens(): { [address: string]: Token } {
  const chainId = useActiveChainId()
  const tokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom)
  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap_, token) => {
            tokenMap_[token.address] = token
            return tokenMap_
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    )
  }, [userAddedTokens, tokenMap, chainId])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find((token) => currency?.equals(token))
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  return !!activeTokens[token.address]
}

// all token balances only return the balances from `useAllTokens` not included unlisted tokens in account resources
export function useAllTokenBalances() {
  const allTokens = useAllTokens()

  const accountResources = useAccountResources({
    address: useAccount()?.account?.address,
    watch: true,
    select: (data) => {
      const coinStore = data
        .filter(coinStoreResourcesFilter)
        .map((coin) => {
          const address = wrapCoinStoreTypeTag(coin.type)

          if (allTokens[address]) {
            return [address, CurrencyAmount.fromRawAmount(allTokens[address], (coin.data as any).coin.value)]
          }
          return null
        })
        .filter(Boolean) as [string, CurrencyAmount<Coin>][]

      const pairs = fromPairs(coinStore)
      return pairs
    },
  })

  return accountResources.data
}
