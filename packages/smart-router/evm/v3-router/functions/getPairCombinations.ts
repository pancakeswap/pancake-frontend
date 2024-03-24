import { ChainId } from '@pancakeswap/chains'
import { GAUGES_CONFIG, GaugeConfig, GaugeType } from '@pancakeswap/gauges'
import { Currency, Token } from '@pancakeswap/sdk'
import { getTokensByChain } from '@pancakeswap/tokens'
import flatMap from 'lodash/flatMap.js'
import memoize from 'lodash/memoize.js'
import uniqBy from 'lodash/uniqBy.js'
import type { Address } from 'viem'

import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../../constants'
import { wrappedCurrency } from '../../utils/currency'
import { isCurrenciesSameChain, log } from '../utils'

const allGauges = GAUGES_CONFIG[ChainId.BSC]

const getToken = memoize(
  (chainId?: ChainId, address?: Address): Token | undefined => {
    if (!chainId || !address) {
      return undefined
    }
    const tokens = getTokensByChain(chainId)
    for (const token of tokens) {
      if (token.address.toLowerCase() === address.toLowerCase()) {
        return token
      }
    }
    return undefined
  },
  (chainId, address) => `${chainId}_${address}`,
)

// TODO: move to gauges
const getGaugesByChain = memoize(
  (chainId?: ChainId): GaugeConfig[] => allGauges.filter((gauge) => gauge.chainId === chainId),
  (chainId) => chainId,
)

function isTokenInCommonBases(token?: Token) {
  return Boolean(token && BASES_TO_CHECK_TRADES_AGAINST[token.chainId as ChainId]?.find((t) => t.equals(token)))
}

const getTokenBasesFromGauges = memoize(
  (currency?: Currency): Token[] => {
    const chainId: ChainId | undefined = currency?.chainId
    const address = currency?.wrapped.address
    const gauges = getGaugesByChain(currency?.chainId)
    const bases = new Set<Token>()
    const addTokenToBases = (token?: Token) => token && !isTokenInCommonBases(token) && bases.add(token)
    const addTokensToBases = (tokens: Token[]) => tokens.forEach(addTokenToBases)
    const isCurrentToken = (addr: Address) => addr.toLowerCase() === address?.toLowerCase()

    if (currency && chainId && isTokenInCommonBases(currency.wrapped)) {
      return []
    }
    for (const gauge of gauges) {
      const { type } = gauge
      if (type === GaugeType.V2 || type === GaugeType.V3) {
        const { token0Address, token1Address } = gauge
        if (isCurrentToken(token0Address)) {
          addTokenToBases(getToken(chainId, token1Address))
        }
        if (isCurrentToken(token1Address)) {
          addTokenToBases(getToken(chainId, token0Address))
        }
        continue
      }
      if (type === GaugeType.StableSwap) {
        const { tokenAddresses } = gauge
        const index = tokenAddresses.findIndex(isCurrentToken)
        if (index < 0) {
          continue
        }
        addTokensToBases(
          [...tokenAddresses.slice(0, index), ...tokenAddresses.slice(index + 1)]
            .map((addr) => getToken(chainId, addr))
            .filter((token?: Token): token is Token => Boolean(token)),
        )
      }
    }
    const baseList = Array.from(bases)
    log(
      `[ADDITIONAL_BASES] Token ${currency?.symbol}, bases from guages: [${baseList
        .map((base) => base.symbol)
        .join(',')}]`,
    )
    return baseList
  },
  (c) => `${c?.chainId}_${c?.wrapped.address}`,
)

const resolver = (currencyA?: Currency, currencyB?: Currency) => {
  if (
    !currencyA ||
    !currencyB ||
    currencyA.chainId !== currencyB.chainId ||
    currencyA.wrapped.equals(currencyB.wrapped)
  ) {
    return `${currencyA?.chainId}_${currencyA?.wrapped?.address}_${currencyB?.wrapped?.address}`
  }
  const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
    ? [currencyA.wrapped, currencyB.wrapped]
    : [currencyB.wrapped, currencyA.wrapped]
  return `${token0.chainId}_${token0.address}_${token1.address}`
}

type TokenBases = {
  [tokenAddress: Address]: Token[]
}

function getAdditionalCheckAgainstBaseTokens(currencyA?: Currency, currencyB?: Currency) {
  const chainId: ChainId | undefined = currencyA?.chainId
  const additionalBases: TokenBases = {
    ...(chainId ? ADDITIONAL_BASES[chainId] ?? {} : {}),
  }
  const uniq = (tokens: Token[]) => uniqBy(tokens, (t) => t.address)
  const additionalA =
    currencyA && chainId
      ? uniq([...(additionalBases[currencyA.wrapped.address] || []), ...getTokenBasesFromGauges(currencyA)]) ?? []
      : []
  const additionalB =
    currencyB && chainId
      ? uniq([...(additionalBases[currencyB.wrapped.address] || []), ...getTokenBasesFromGauges(currencyB)]) ?? []
      : []

  return [...additionalA, ...additionalB]
}

export const getCheckAgainstBaseTokens = memoize((currencyA?: Currency, currencyB?: Currency): Token[] => {
  // eslint-disable-next-line prefer-destructuring
  const chainId: ChainId | undefined = currencyA?.chainId
  if (!chainId || !currencyA || !currencyB || !isCurrenciesSameChain(currencyA, currencyB)) {
    return []
  }

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  if (!tokenA || !tokenB) {
    return []
  }

  const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []

  return [...common, ...getAdditionalCheckAgainstBaseTokens(currencyA, currencyB)]
}, resolver)

export const getPairCombinations = memoize((currencyA?: Currency, currencyB?: Currency): [Currency, Currency][] => {
  // eslint-disable-next-line prefer-destructuring
  const chainId: ChainId | undefined = currencyA?.chainId
  if (!chainId || !currencyA || !currencyB || !isCurrenciesSameChain(currencyA, currencyB)) {
    return []
  }

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  if (!tokenA || !tokenB) {
    return []
  }

  const bases = getCheckAgainstBaseTokens(currencyA, currencyB)

  const basePairs: [Currency, Currency][] = flatMap(bases, (base): [Currency, Currency][] =>
    bases.map((otherBase) => [base, otherBase]),
  )

  return [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base): [Currency, Currency] => [tokenA, base]),
    // token B against all bases
    ...bases.map((base): [Currency, Currency] => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ]
    .filter((tokens): tokens is [Currency, Currency] => Boolean(tokens[0] && tokens[1]))
    .filter(([t0, t1]) => !t0.equals(t1))
    .filter(([tokenA_, tokenB_]) => {
      if (!chainId) return true
      const customBases = CUSTOM_BASES[chainId]

      const customBasesA: Currency[] | undefined = customBases?.[tokenA_.wrapped.address]
      const customBasesB: Currency[] | undefined = customBases?.[tokenB_.wrapped.address]

      if (!customBasesA && !customBasesB) return true

      if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
      if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

      return true
    })
}, resolver)
