/* eslint-disable no-param-reassign */
import { ChainId, ERC20Token, OnRampCurrency } from '@pancakeswap/sdk'
import { Currency, FiatOnRampCurrency } from '@pancakeswap/swap-sdk-core'

import { TokenAddressMap } from '@pancakeswap/token-lists'
import { GELATO_NATIVE } from 'config/constants'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useToken as useToken_ } from 'wagmi'
import {
  combinedCurrenciesMapFromActiveUrlsAtom,
  combinedFiatCurrenciesMapFromActiveUrlsAtom,
  combinedTokenMapFromActiveUrlsAtom,
  combinedTokenMapFromOfficialsUrlsAtom,
  useUnsupportedTokenList,
  useWarningTokenList,
} from '../state/lists/hooks'
import useUserAddedTokens from '../state/user/hooks/useUserAddedTokens'
import { isAddress } from '../utils'
import { useActiveChainId } from './useActiveChainId'
import useNativeCurrency from './useNativeCurrency'

const mapWithoutUrls = (tokenMap?: TokenAddressMap<ChainId>, chainId?: number) => {
  if (!tokenMap || !chainId) return {}
  return Object.keys(tokenMap[chainId] || {}).reduce<{ [address: string]: ERC20Token }>((newMap, address) => {
    const checksummedAddress = isAddress(address)

    if (checksummedAddress && !newMap[checksummedAddress]) {
      newMap[checksummedAddress] = tokenMap[chainId][address].token
    }

    return newMap
  }, {})
}

const mapWithoutUrlsAllChains = (tokenMap: TokenAddressMap<ChainId>) => {
  const tokens = Object.keys(tokenMap).flatMap((id: string) => Object.entries(tokenMap[id]))
  const mappedTokens = Object.fromEntries(tokens.map(([symbol, { token }]) => [symbol, token]))
  return mappedTokens
}

/**
 * Returns all tokens that are from active urls and user added tokens
 */
export function useAllTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const tokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom)
  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            const checksummedAddress = isAddress(token.address)

            if (checksummedAddress) {
              tokenMap_[checksummedAddress] = token
            }

            return tokenMap_
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    )
  }, [userAddedTokens, tokenMap, chainId])
}

export function useAllOnRampTokens(): { [address: string]: OnRampCurrency } {
  const tokenMap = useAtomValue(combinedCurrenciesMapFromActiveUrlsAtom)
  return useMemo(() => {
    return mapWithoutUrlsAllChains(tokenMap)
  }, [tokenMap])
}

export function useAllFiatCurrencies(): { [address: string]: FiatOnRampCurrency } {
  const tokenMap = useAtomValue(combinedFiatCurrenciesMapFromActiveUrlsAtom)
  return tokenMap
}

/**
 * Returns all tokens that are from officials token list and user added tokens
 */
export function useOfficialsAndUserAddedTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)

  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            const checksummedAddress = isAddress(token.address)

            if (checksummedAddress) {
              tokenMap_[checksummedAddress] = token
            }

            return tokenMap_
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    )
  }, [userAddedTokens, tokenMap, chainId])
}

export function useUnsupportedTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const unsupportedTokensMap = useUnsupportedTokenList()
  return useMemo(() => mapWithoutUrls(unsupportedTokensMap, chainId), [unsupportedTokensMap, chainId])
}

export function useWarningTokens(): { [address: string]: ERC20Token } {
  const warningTokensMap = useWarningTokenList()
  const { chainId } = useActiveChainId()
  return useMemo(() => mapWithoutUrls(warningTokensMap, chainId), [warningTokensMap, chainId])
}

export function useIsTokenActive(token: ERC20Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  const tokenAddress = isAddress(token.address)

  return tokenAddress && !!activeTokens[tokenAddress]
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find((token) => currency?.equals(token))
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const { chainId } = useActiveChainId()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const token: ERC20Token | undefined = address ? tokens[address] : undefined

  const { data, isLoading } = useToken_({
    address: address || undefined,
    chainId,
    enabled: Boolean(!!address && !token),
    // consider longer stale time
  })

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (isLoading) return null
    if (data) {
      return new ERC20Token(
        chainId,
        data.address,
        data.decimals,
        data.symbol ?? 'UNKNOWN',
        data.name ?? 'Unknown Token',
      )
    }
    return undefined
  }, [token, chainId, address, isLoading, data])
}

export function useOnRampToken(tokenAddress?: string): OnRampCurrency | undefined {
  const { chainId } = useActiveChainId()
  const tokens = useAllOnRampTokens()

  const address = isAddress(tokenAddress)

  const token: OnRampCurrency | undefined = tokens[tokenAddress]

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    return undefined
  }, [token, chainId, address])
}

export function useOnRampFiatCurrency(tokenAddress?: string): FiatOnRampCurrency | undefined {
  const tokens = useAllFiatCurrencies()
  const address = isAddress(tokenAddress)

  const token: FiatOnRampCurrency | undefined = tokens[tokenAddress]

  return useMemo(() => {
    if (token) return token
    if (!address) return undefined
    return undefined
  }, [token, address])
}

export function useCurrency(currencyId: string | undefined): Currency | ERC20Token | null | undefined {
  const native = useNativeCurrency()
  const isNative =
    currencyId?.toUpperCase() === native.symbol?.toUpperCase() || currencyId?.toLowerCase() === GELATO_NATIVE
  const token = useToken(isNative ? undefined : currencyId)
  return isNative ? native : token
}

export function useFiatCurrency(currencyId: string | undefined): FiatOnRampCurrency | null | undefined {
  const token = useOnRampFiatCurrency(currencyId)
  return token
}

export function useOnRampCurrency(currencyId: string | undefined): Currency | ERC20Token | null | undefined {
  const native = useNativeCurrency()
  const isNative =
    currencyId?.toUpperCase() === native.symbol?.toUpperCase() || currencyId?.toLowerCase() === GELATO_NATIVE
  const token = useOnRampToken(currencyId)
  return isNative ? native : token
}
