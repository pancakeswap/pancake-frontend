/* eslint-disable camelcase */
import { Pair, PAIR_RESERVE_TYPE_TAG, SWAP_ADDRESS } from '@pancakeswap/aptos-swap-sdk'
import { useProvider } from '@pancakeswap/awgmi'
import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import fromPairs from 'lodash/fromPairs'
import { useMemo } from 'react'
import useSWR from 'swr'
import { useActiveChainId, useActiveNetwork } from './useNetwork'

function useFetchAllPairs() {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()

  const provider = useProvider({ networkName })
  return useSWR(['all-pairs-reserves', networkName, chainId], async () => {
    const swapResources = await provider.getAccountResources(SWAP_ADDRESS)
    const allPairData = swapResources.filter((r) => r.type.includes(PAIR_RESERVE_TYPE_TAG)) as {
      type: string
      data: { reserve_x: string; reserve_y: string; block_timestamp_last: string }
    }[]

    return fromPairs(allPairData.map((p) => [p.type, p]))
  })
}

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { data } = useFetchAllPairs()

  const tokens = useMemo(() => currencies.map(([a, b]) => [a?.wrapped, b?.wrapped]), [currencies])

  return useMemo(() => {
    return tokens.map(([tokenA, tokenB]) => {
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
        return [PairState.INVALID, null]
      }
      const pairAddress = Pair.getReservesAddress(tokenA, tokenB)

      if (data?.[pairAddress]) {
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        return [
          PairState.EXISTS,
          new Pair(
            CurrencyAmount.fromRawAmount(token0, data[pairAddress].data.reserve_x),
            CurrencyAmount.fromRawAmount(token1, data[pairAddress].data.reserve_y),
          ),
        ]
      }
      return [PairState.NOT_EXISTS, null]
    })
  }, [data, tokens])
}
