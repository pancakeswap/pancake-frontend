/* eslint-disable no-param-reassign */
import { Coin, Currency, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountResources, APTOS_COIN, useCoin } from '@pancakeswap/awgmi'
import { fetchCoin, coinStoreResourcesFilter } from '@pancakeswap/awgmi/core'
import { useAtomValue } from 'jotai'
import fromPairs from 'lodash/fromPairs'
import { useMemo } from 'react'
import {
  combinedTokenMapFromActiveUrlsAtom,
  combinedTokenMapFromOfficialsUrlsAtom,
  TokenAddressMap,
} from 'state/lists/hooks'
import { useUserAddedTokens } from 'state/user'
import useSWRImmutable from 'swr/immutable'
import useActiveWeb3React from './useActiveWeb3React'
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

export function useCoins(addresses: string[]) {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()

  return useSWRImmutable(addresses && networkName && chainId ? [addresses, networkName, chainId] : null, async () => {
    const allCoinsMeta = await Promise.all(
      addresses.map((address) => (address ? fetchCoin({ networkName, coin: address }) : Promise.resolve(null))),
    )

    return allCoinsMeta.map((result, i) => {
      if (result) {
        const { decimals, symbol, name } = result
        return new Coin(chainId, addresses[i], decimals, symbol, name)
      }
      return null
    })
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

const coinStoreTypeHead = '0x1::coin::CoinStore<'

export function useAllTokenBalances() {
  const allTokens = useAllTokens()

  const accountResources = useAccountResources({
    address: useAccount()?.account?.address,
    watch: true,
    select: (data) => {
      const coinStore = data
        .filter(coinStoreResourcesFilter)
        .map((coin) => {
          const address = coin.type.split(coinStoreTypeHead)[1].split('>')[0]

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

/**
 * Returns all tokens that are from officials token list and user added tokens
 */
export function useOfficialsAndUserAddedTokens(): { [address: string]: Coin } {
  const { chainId } = useActiveWeb3React()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)
  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Coin }>(
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
