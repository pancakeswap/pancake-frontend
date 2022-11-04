import { ChainId, Currency, Pair, Token } from '@pancakeswap/sdk'
import flatMap from 'lodash/flatMap'

import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from './config'
import { wrappedCurrency } from './utils/currency'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export async function getAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Promise<Pair[]> {
  const chainId = 56

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
  const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
  const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

  const bases: Token[] = [...common, ...additionalA, ...additionalB]

  const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
    bases.map((otherBase) => [base, otherBase]),
  )

  const allPairCombinations = getAllPairCombinations(tokenA, tokenB, bases, basePairs, chainId)

  // TODO get pairs with reserve data on chain
  // const allPairs = await getPairs(allPairCombinations, chainId)
  const allPairs: [PairState, Pair | null][] = []

  // only pass along valid pairs, non-duplicated pairs
  return Object.values(
    allPairs
      // filter out invalid pairs
      .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
      // filter out duplicated pairs
      .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
        memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
        return memo
      }, {}),
  )
}

const getAllPairCombinations = (
  tokenA: Token | undefined,
  tokenB: Token | undefined,
  bases: Token[],
  basePairs: [Token, Token][],
  chainId: ChainId,
): [Token, Token][] => {
  return tokenA && tokenB
    ? [
        // the direct pair
        [tokenA, tokenB],
        // token A against all bases
        ...bases.map((base): [Token, Token] => [tokenA, base]),
        // token B against all bases
        ...bases.map((base): [Token, Token] => [tokenB, base]),
        // each base against all bases
        ...basePairs,
      ]
        .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
        .filter(([t0, t1]) => t0.address !== t1.address)
        .filter(([tokenA_, tokenB_]) => {
          if (!chainId) return true
          const customBases = CUSTOM_BASES[chainId]

          const customBasesA: Token[] | undefined = customBases?.[tokenA_.address]
          const customBasesB: Token[] | undefined = customBases?.[tokenB_.address]

          if (!customBasesA && !customBasesB) return true

          if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
          if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

          return true
        })
    : []
}
