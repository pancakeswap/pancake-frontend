import { ChainId, Currency, CurrencyAmount, Pair, Token } from '@pancakeswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { createMulticall, Call } from '@pancakeswap/multicall'

import { wrappedCurrency } from '../utils/currency'
import IPancakePairABI from '../abis/IPancakePair.json'
import { Provider } from '../types'

type CurrencyPair = [Currency, Currency]

export interface PairReserve {
  reserve0: BigNumber
  reserve1: BigNumber
  blockTimestampLast: BigNumber
}

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

interface Options {
  provider: Provider
  chainId: ChainId
}

export async function getPairs(currencyPairs: CurrencyPair[], { provider, chainId }: Options): Promise<Pair[]> {
  const tokens: [Token | undefined, Token | undefined][] = currencyPairs.map(([currencyA, currencyB]) => [
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ])

  const pairAddresses = tokens.map(getPairAddress)

  const { multicallv2 } = createMulticall(provider)
  const reserveCalls: Call[] = pairAddresses.map((address) => ({
    address: address as string,
    name: 'getReserves',
    params: [],
  }))

  const results = await multicallv2<PairReserve[]>({
    abi: IPancakePairABI,
    calls: reserveCalls,
    chainId,
    options: {
      requireSuccess: false,
    },
  })

  const resultWithState: [PairState, Pair | null][] = results.map((result, i) => {
    if (!result) return [PairState.NOT_EXISTS, null]

    const tokenA = tokens[i][0]
    const tokenB = tokens[i][1]

    if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]

    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

    const { reserve0, reserve1 } = result
    return [
      PairState.EXISTS,
      new Pair(
        CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
        CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
      ),
    ]
  })
  const successfulResult: [PairState.EXISTS, Pair][] = resultWithState.filter(
    (result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]),
  )
  return successfulResult.map(([, pair]) => pair)
}

function getPairAddress([tokenA, tokenB]: [Token | undefined, Token | undefined]): string {
  let addr = ''
  try {
    addr = tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : ''
  } catch (error: any) {
    // Debug Invariant failed related to this line
    console.error(error.msg, `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`, `chainId: ${tokenA?.chainId}`)
  }
  return addr
}
