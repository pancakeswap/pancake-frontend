/* eslint-disable camelcase */
import { Currency, CurrencyAmount, Pair, PAIR_RESERVE_TYPE_TAG, SWAP_ADDRESS } from '@pancakeswap/aptos-swap-sdk'
import { useAccountResources } from '@pancakeswap/awgmi'
import fromPairs from 'lodash/fromPairs'
import { useMemo } from 'react'
import { useCoins } from './Tokens'

const pairReserveSelector = (swapResources) => {
  const allPairData = swapResources.filter((r) => r.type.includes(PAIR_RESERVE_TYPE_TAG)) as {
    type: string
    data: { reserve_x: string; reserve_y: string; block_timestamp_last: string }
  }[]

  return fromPairs(allPairData.map((p) => [p.type, p]))
}

// TODO: aptos this will fetch all lp reserve under swap resource account, will eventually be huge
function useFetchAllPairsReserves() {
  return useAccountResources({
    address: SWAP_ADDRESS,
    select: pairReserveSelector,
    watch: true,
  })
}

export function usePairsFromAddresses(addresses: string[]) {
  const { data } = useFetchAllPairsReserves()

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
      if (data?.[address]) {
        const [address0, address1] = Pair.parseType(address)

        const coin0 = coins?.find((c) => c?.address === address0)
        const coin1 = coins?.find((c) => c?.address === address1)

        if (coin0 && coin1) {
          return [
            PairState.EXISTS,
            new Pair(
              CurrencyAmount.fromRawAmount(coin0, data[address].data.reserve_x),
              CurrencyAmount.fromRawAmount(coin1, data[address].data.reserve_y),
            ),
          ]
        }
        return [PairState.LOADING, null]
      }
      return [PairState.NOT_EXISTS, null]
    })
  }, [addresses, data, coinsResults])
}

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { data } = useFetchAllPairsReserves()

  const tokens = useMemo(() => currencies.map(([a, b]) => [a?.wrapped, b?.wrapped]), [currencies])

  return useMemo(() => {
    return tokens.map(([tokenA, tokenB]) => {
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
        return [PairState.INVALID, null]
      }
      const pairAddress = Pair.getReservesAddress(tokenA, tokenB)

      if (data?.[pairAddress]) {
        const [token0, token1] = Pair.sortToken(tokenA, tokenB)
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

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const pairCurrencies = useMemo<[Currency | undefined, Currency | undefined][]>(
    () => [[tokenA, tokenB]],
    [tokenA, tokenB],
  )
  return usePairs(pairCurrencies)[0]
}
