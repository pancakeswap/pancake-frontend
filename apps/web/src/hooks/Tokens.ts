/* eslint-disable no-param-reassign */
import { ChainId } from '@pancakeswap/chains'
import { type Address, zeroAddress } from 'viem'
import { ERC20Token } from '@pancakeswap/sdk'
import { Currency, NativeCurrency } from '@pancakeswap/swap-sdk-core'

import { TokenAddressMap } from '@pancakeswap/token-lists'
import { useReadContracts } from '@pancakeswap/wagmi'
import { GELATO_NATIVE } from 'config/constants'
import { UnsafeCurrency } from 'config/constants/types'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
  combinedCurrenciesMapFromActiveUrlsAtom,
  combinedTokenMapFromActiveUrlsAtom,
  combinedTokenMapFromOfficialsUrlsAtom,
  useUnsupportedTokenList,
  useWarningTokenList,
} from 'state/lists/hooks'
import { safeGetAddress } from 'utils'
import { erc20Abi } from 'viem'
import useUserAddedTokens, { useUserAddedTokensByChainIds } from '../state/user/hooks/useUserAddedTokens'
import { useActiveChainId } from './useActiveChainId'
import useNativeCurrency from './useNativeCurrency'

const mapWithoutUrls = (tokenMap?: TokenAddressMap<ChainId>, chainId?: number) => {
  if (!tokenMap || !chainId) return {}
  return Object.keys(tokenMap[chainId] || {}).reduce<{ [address: string]: ERC20Token }>((newMap, address) => {
    const checksumAddress = safeGetAddress(address)

    if (checksumAddress && !newMap[checksumAddress]) {
      newMap[checksumAddress] = tokenMap[chainId][address].token
    }

    return newMap
  }, {})
}

const mapWithoutUrlsBySymbol = (tokenMap?: TokenAddressMap<ChainId>, chainId?: number) => {
  if (!tokenMap || !chainId) return {}
  return Object.keys(tokenMap[chainId] || {}).reduce<{ [symbol: string]: ERC20Token }>((newMap, symbol) => {
    newMap[symbol] = tokenMap[chainId][symbol].token

    return newMap
  }, {})
}

/**
 * Returns all tokens of activeChain that are from active urls and user added tokens
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
            const checksumAddress = safeGetAddress(token.address)

            if (checksumAddress) {
              tokenMap_[checksumAddress] = token
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

export type TokenChainAddressMap<TChainId extends number = number> = {
  [chainId in TChainId]: {
    [tokenAddress: Address]: ERC20Token
  }
}

export function useTokensByChainIds(chainIds: number[], tokenMap: TokenAddressMap<ChainId>): TokenChainAddressMap {
  const userAddedTokenMap = useUserAddedTokensByChainIds(chainIds)
  return useMemo(() => {
    return chainIds.reduce<TokenChainAddressMap>((tokenMap_, chainId) => {
      tokenMap_[chainId] = tokenMap_[chainId] || {}
      userAddedTokenMap[chainId].forEach((token) => {
        const checksumAddress = safeGetAddress(token.address)
        if (checksumAddress) {
          tokenMap_[chainId][checksumAddress] = token
        }
      })
      Object.keys(tokenMap[chainId] || {}).forEach((address) => {
        const checksumAddress = safeGetAddress(address)
        if (checksumAddress && !tokenMap_[chainId][checksumAddress]) {
          tokenMap_[chainId][checksumAddress] = tokenMap[chainId][address].token
        }
      })

      return tokenMap_
    }, {})
  }, [userAddedTokenMap, tokenMap, chainIds])
}

/**
 * Returns all tokens that are from active urls and user added tokens
 */
export function useAllTokensByChainIds(chainIds: number[]): TokenChainAddressMap {
  const allTokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom)
  return useTokensByChainIds(chainIds, allTokenMap)
}

export function useOfficialsAndUserAddedTokensByChainIds(chainIds: number[]): TokenChainAddressMap {
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)
  return useTokensByChainIds(chainIds, tokenMap)
}

export function useAllOnRampTokens(): { [address: string]: Currency } {
  const { chainId } = useActiveChainId()
  const tokenMap = useAtomValue(combinedCurrenciesMapFromActiveUrlsAtom)
  return useMemo(() => {
    return mapWithoutUrlsBySymbol(tokenMap, chainId)
  }, [tokenMap, chainId])
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
            const checksumAddress = safeGetAddress(token.address)

            if (checksumAddress) {
              tokenMap_[checksumAddress] = token
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

  const tokenAddress = safeGetAddress(token.address)

  return Boolean(tokenAddress && !!activeTokens[tokenAddress])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency?.equals) {
    return false
  }

  return !!userAddedTokens.find((token) => currency?.equals(token))
}

export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const { chainId } = useActiveChainId()
  return useTokenByChainId(tokenAddress, chainId)
}
// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useTokenByChainId(tokenAddress?: string, chainId?: number): ERC20Token | undefined | null {
  const unsupportedTokens = useUnsupportedTokens()
  const tokens = useAllTokensByChainIds(chainId ? [chainId] : [])

  const address = safeGetAddress(tokenAddress)

  const token: ERC20Token | undefined = address && chainId ? tokens[chainId][address] : undefined

  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        chainId,
        address,
        abi: erc20Abi,
        functionName: 'name',
      },
    ],
    query: {
      enabled: Boolean(!token && address),
      staleTime: Infinity,
    },
  })

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (unsupportedTokens[address]) return undefined
    if (isLoading) return null
    if (data) {
      return new ERC20Token(chainId, address, data[0], data[1] ?? 'UNKNOWN', data[2] ?? 'Unknown Token')
    }
    return undefined
  }, [token, chainId, address, isLoading, data, unsupportedTokens])
}

export function useOnRampToken(currencyId?: string): Currency | undefined {
  const { chainId } = useActiveChainId()
  const tokens = useAllOnRampTokens()
  const token = currencyId && tokens[currencyId]

  return useMemo(() => {
    if (token) return token
    if (!chainId || !currencyId) return undefined
    return undefined
  }, [token, chainId, currencyId])
}

export function useCurrency(currencyId: string | undefined): UnsafeCurrency {
  const native: NativeCurrency = useNativeCurrency()
  const isNative =
    currencyId?.toUpperCase() === native.symbol?.toUpperCase() ||
    currencyId?.toLowerCase() === GELATO_NATIVE ||
    currencyId?.toLowerCase() === zeroAddress

  const token = useToken(isNative ? undefined : currencyId)
  return isNative ? native : token
}

export function useOnRampCurrency(currencyId: string | undefined): NativeCurrency | Currency | null | undefined {
  const native: NativeCurrency = useNativeCurrency()
  const isNative =
    currencyId?.toUpperCase() === native.symbol?.toUpperCase() ||
    currencyId?.toLowerCase() === GELATO_NATIVE ||
    currencyId?.toLowerCase() === zeroAddress
  const token = useOnRampToken(currencyId)

  return isNative ? native : token
}
