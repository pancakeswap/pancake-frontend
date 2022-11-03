/* eslint-disable camelcase */
import { UseQueryResult } from '@tanstack/react-query'
import { Currency, CurrencyAmount, Pair, SWAP_ADDRESS } from '@pancakeswap/aptos-swap-sdk'
import { accountResourceQueryKey, useQueries } from '@pancakeswap/awgmi'
import { fetchAccountResource } from '@pancakeswap/awgmi/core'
import fromPairs from 'lodash/fromPairs'
import { useMemo } from 'react'
import { useCoins } from './Tokens'
import { useActiveNetwork } from './useNetwork'

export function usePairsFromAddresses(addresses: string[]) {
  const pairReserves = usePairReservesQueries(addresses)

  const parsesAddress = useMemo(
    () =>
      addresses.flatMap((addr) => {
        return Pair.parseType(addr)
      }),
    [addresses],
  )

  const coinsResults = useCoins(parsesAddress)

  return useMemo(() => {
    const coins = coinsResults.map((coinResult) => coinResult.data)

    return addresses.map((address) => {
      if (pairReserves?.[address]) {
        const [address0, address1] = Pair.parseType(address)

        const coin0 = coins?.find((c) => c?.address === address0)
        const coin1 = coins?.find((c) => c?.address === address1)

        if (coin0 && coin1) {
          return [
            PairState.EXISTS,
            new Pair(
              CurrencyAmount.fromRawAmount(coin0, pairReserves[address].data.reserve_x),
              CurrencyAmount.fromRawAmount(coin1, pairReserves[address].data.reserve_y),
            ),
          ]
        }
        return [PairState.LOADING, null]
      }
      return [PairState.NOT_EXISTS, null]
    })
  }, [addresses, pairReserves, coinsResults])
}

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

function usePairReservesQueries(pairAddresses: (string | undefined)[]) {
  const { networkName } = useActiveNetwork()

  const pairReservesQueries = useQueries({
    queries: useMemo(
      () =>
        pairAddresses.map((pairAddress) => ({
          enable: Boolean(pairAddress),
          queryFn: () => {
            if (!pairAddress) throw new Error('No pair address')
            return fetchAccountResource({ address: SWAP_ADDRESS, resourceType: pairAddress, networkName })
          },
          queryKey: accountResourceQueryKey({ address: SWAP_ADDRESS, resourceType: pairAddress, networkName }),
          staleTime: Infinity,
          refetchInterval: 3_000,
        })),
      [networkName, pairAddresses],
    ),
  }) as UseQueryResult<{
    type: string
    data: { reserve_x: string; reserve_y: string; block_timestamp_last: string }
  }>[]

  const pairReserves = useMemo(
    () =>
      fromPairs(
        pairReservesQueries
          .filter((p) => Boolean(p.data))
          .map(
            (p) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              [p.data!.type, p.data] as [
                string,
                {
                  type: string
                  data: {
                    reserve_x: string
                    reserve_y: string
                    block_timestamp_last: string
                  }
                },
              ],
          ),
      ),
    [pairReservesQueries],
  )

  return pairReserves || {}
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const tokens = useMemo(() => currencies.map(([a, b]) => [a?.wrapped, b?.wrapped]), [currencies])
  const pairAddresses = useMemo(
    () => [
      ...new Set(
        tokens.map(([tokenA, tokenB]) => {
          if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
            return undefined
          }
          return Pair.getReservesAddress(tokenA, tokenB)
        }),
      ),
    ],
    [tokens],
  )

  const pairReserves = usePairReservesQueries(pairAddresses)

  return useMemo(() => {
    return tokens.map(([tokenA, tokenB]) => {
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
        return [PairState.INVALID, null]
      }
      const pairAddress = Pair.getReservesAddress(tokenA, tokenB)

      if (pairReserves?.[pairAddress]) {
        const [token0, token1] = Pair.sortToken(tokenA, tokenB)
        return [
          PairState.EXISTS,
          new Pair(
            CurrencyAmount.fromRawAmount(token0, pairReserves[pairAddress].data.reserve_x),
            CurrencyAmount.fromRawAmount(token1, pairReserves[pairAddress].data.reserve_y),
          ),
        ]
      }
      return [PairState.NOT_EXISTS, null]
    })
  }, [pairReserves, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const pairCurrencies = useMemo<[Currency | undefined, Currency | undefined][]>(
    () => [[tokenA, tokenB]],
    [tokenA, tokenB],
  )
  return usePairs(pairCurrencies)[0]
}
