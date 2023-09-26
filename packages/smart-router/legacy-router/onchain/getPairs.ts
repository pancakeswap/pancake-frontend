import { Currency, CurrencyAmount, Pair, Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

import { wrappedCurrency } from '../../evm/utils/currency'
import { pancakePairABI } from '../../evm/abis/IPancakePair'

import { Provider } from '../types'

type CurrencyPair = [Currency, Currency]

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

  const client = provider({ chainId })

  const results = await client.multicall({
    contracts: pairAddresses.map(
      (address) =>
        ({
          abi: pancakePairABI,
          address,
          functionName: 'getReserves',
        } as const),
    ),
    allowFailure: true,
  })

  const resultWithState: [PairState, Pair | null][] = results.map((result, i) => {
    if (!result || result.status !== 'success') return [PairState.NOT_EXISTS, null]

    const tokenA = tokens[i][0]
    const tokenB = tokens[i][1]

    if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]

    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

    const [reserve0, reserve1] = result.result
    return [
      PairState.EXISTS,
      new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1)),
    ]
  })
  const successfulResult: [PairState.EXISTS, Pair][] = resultWithState.filter(
    (result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]),
  )
  return successfulResult.map(([, pair]) => pair)
}

function getPairAddress([tokenA, tokenB]: [Token | undefined, Token | undefined]): Address {
  let addr: Address = '0x'
  try {
    addr = tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : '0x'
  } catch (error: any) {
    // Debug Invariant failed related to this line
    console.error(error.msg, `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`, `chainId: ${tokenA?.chainId}`)
  }
  return addr
}
