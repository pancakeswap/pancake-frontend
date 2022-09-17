/* eslint-disable no-param-reassign */
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountResources } from '@pancakeswap/awgmi'
import { fetchCoin } from '@pancakeswap/awgmi/core'
import fromPairs from 'lodash/fromPairs'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { combinedTokenMapFromActiveUrlsAtom, TokenAddressMap } from 'state/lists/hooks'
import { useUserAddedTokens } from 'state/user'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId, useActiveNetwork } from './useNetwork'

export function useToken(coinId?: string) {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()

  return useSWRImmutable(coinId && networkName && chainId ? [coinId, networkName, chainId] : null, async () => {
    if (!chainId || !coinId) return undefined
    const { decimals, symbol, name } = await fetchCoin({ networkName, coin: coinId })

    return new Coin(chainId, coinId, decimals, symbol, name)
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
        .filter((d) => d.type.includes(coinStoreTypeHead))
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
