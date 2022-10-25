/* eslint-disable no-param-reassign */
import { Coin, Currency, CurrencyAmount, Token } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN, useAccount, useAccountResources, useCoin, useCoins as useCoins_ } from '@pancakeswap/awgmi'
import { coinStoreResourcesFilter, unwrapTypeFromString, wrapCoinStoreTypeTag } from '@pancakeswap/awgmi/core'
import { TxnBuilderTypes, TypeTagParser } from 'aptos'
import { useAtomValue } from 'jotai'
import fromPairs from 'lodash/fromPairs'
import { useCallback, useMemo } from 'react'
import { combinedTokenMapFromActiveUrlsAtom, TokenAddressMap } from 'state/lists/hooks'
import { useUserAddedTokens, useUserShowWalletCoins } from 'state/user'
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
  const token = coinId ? tokens[coinId] : undefined

  const coin = useCoin({
    coin: coinId,
    networkName,
    initialData: token
      ? {
          address: token.address,
          decimals: token.decimals,
          name: token.name ?? '',
          symbol: token.symbol,
        }
      : undefined,
    select: (d) => {
      const { decimals, symbol, name } = d
      if (token) return token
      if (!coinId) return undefined
      return new Coin(chainId, coinId, decimals, symbol, name)
    },
  })

  return coin
}

export function useCoins(addresses: string[]) {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()
  const tokens = useAllTokens()
  const native = useNativeCurrency()

  const select = useCallback(
    (result) => {
      const isNative = result.address === APTOS_COIN

      if (isNative) return native

      return tokens[result.address] || new Coin(chainId, result.address, result.decimals, result.symbol, result.name)
    },
    [chainId, tokens, native],
  )

  return useCoins_({
    coins: addresses,
    networkName,
    select,
    enabled: !addresses || !addresses.length,
  })
}

const mapWithoutUrls = (tokenMap: TokenAddressMap, chainId: number) =>
  Object.keys(tokenMap[chainId] || {}).reduce<{ [address: string]: Token }>((newMap, address) => {
    newMap[address] = tokenMap[chainId][address].token
    return newMap
  }, {})

function useTokenFromListAndUserAddedToken() {
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

export function useAllTokens(): { [address: string]: Token } {
  const chainId = useActiveChainId()
  const [showWalletCoins] = useUserShowWalletCoins()
  const { account } = useAccount()

  const tokenListAndUserAddedTokens = useTokenFromListAndUserAddedToken()

  const { data: coinResources } = useAccountResources({
    enabled: showWalletCoins,
    address: account?.address,
    select: (resources) =>
      resources
        .filter(coinStoreResourcesFilter)
        .filter(
          (coin) =>
            coin.type !== wrapCoinStoreTypeTag(APTOS_COIN) &&
            coin.data.coin.value !== '0' &&
            unwrapTypeFromString(coin.type) &&
            !tokenListAndUserAddedTokens[unwrapTypeFromString(coin.type) ?? ''],
        )
        .filter((r) => {
          const parsedTypeTag = new TypeTagParser(r.type).parseTypeTag()
          if (
            parsedTypeTag instanceof TxnBuilderTypes.TypeTagStruct &&
            parsedTypeTag.value.type_args.length === 1 &&
            parsedTypeTag.value.type_args[0] instanceof TxnBuilderTypes.TypeTagStruct &&
            parsedTypeTag.value.type_args[0].value.type_args.length === 0
          ) {
            return true
          }
          return false
        }),
  })

  const coins = useCoins_({
    enabled: showWalletCoins && !!coinResources,
    coins: useMemo(
      () => (coinResources?.map((r) => unwrapTypeFromString(r.type)).filter(Boolean) as string[]) ?? [],
      [coinResources],
    ),
    select(data) {
      return new Coin(chainId, data.address, data.decimals, data.symbol, data.name)
    },
  })

  return useMemo(() => {
    if (!showWalletCoins) return tokenListAndUserAddedTokens
    return coins.reduce((tokenMap_, coin) => {
      if (coin.data?.address && !tokenMap_[coin.data.address]) {
        tokenMap_[coin.data.address] = coin.data
      }
      return tokenMap_
    }, tokenListAndUserAddedTokens)
  }, [tokenListAndUserAddedTokens, coins, showWalletCoins])
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
          const address = unwrapTypeFromString(coin.type)

          if (address && allTokens[address]) {
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
