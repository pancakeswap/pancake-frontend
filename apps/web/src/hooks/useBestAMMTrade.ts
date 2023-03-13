/* eslint-disable no-console */
import useSWR from 'swr'
import { useDeferredValue, useEffect, useMemo } from 'react'
import { SmartRouter, PoolType } from '@pancakeswap/smart-router/evm'
import { CurrencyAmount, TradeType, Currency, JSBI } from '@pancakeswap/sdk'
import { useDebounce } from '@pancakeswap/hooks'

import { provider } from 'utils/wagmi'
import { useCurrentBlock } from 'state/block/hooks'

import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { useUserStableSwapEnable, useUserV2SwapEnable, useUserV3SwapEnable } from 'state/user/smartRouter'
import { useCommonPools } from './useCommonPools'

interface Options {
  amount?: CurrencyAmount<Currency>
  baseCurrency?: Currency
  currency?: Currency
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
}

const quoteProvider = SmartRouter.createOffChainQuoteProvider()

export function useBestAMMTrade({ amount, baseCurrency, currency, tradeType, maxHops, maxSplits }: Options) {
  const { gasPrice } = useFeeDataWithGasPrice()

  const blockNumber = useCurrentBlock()
  const {
    refresh,
    pools: candidatePools,
    loading,
    syncing,
  } = useCommonPools(baseCurrency || amount?.currency, currency, { blockNumber })
  const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
  const deferQuotientRaw = useDeferredValue(amount?.quotient.toString())
  const deferQuotient = useDebounce(deferQuotientRaw, 300)
  const [v2Swap] = useUserV2SwapEnable()
  const [v3Swap] = useUserV3SwapEnable()
  const [stableSwap] = useUserStableSwapEnable()

  const poolTypes = useMemo(() => {
    const types: PoolType[] = []
    if (v2Swap) {
      types.push(PoolType.V2)
    }
    if (v3Swap) {
      types.push(PoolType.V3)
    }
    if (stableSwap) {
      types.push(PoolType.STABLE)
    }
    return types
  }, [v2Swap, v3Swap, stableSwap])

  const {
    data: trade,
    isLoading,
    isValidating,
    // mutate,
  } = useSWR(
    amount && currency && candidatePools && !loading
      ? [
          currency.chainId,
          amount.currency.symbol,
          currency.symbol,
          tradeType,
          deferQuotient,
          maxHops,
          maxSplits,
          poolTypes,
        ]
      : null,
    async () => {
      if (!deferQuotient) {
        return null
      }
      const label = '[METRIC] Get best AMM trade'
      console.time(label)
      console.timeLog(
        label,
        'Start',
        currency.chainId,
        amount.currency.symbol,
        currency.symbol,
        tradeType,
        deferQuotient,
        candidatePools,
      )
      const res = await SmartRouter.getBestTrade(amount, currency, tradeType, {
        gasPriceWei: gasPrice
          ? JSBI.BigInt(gasPrice)
          : async () => JSBI.BigInt(await provider({ chainId: amount.currency.chainId }).getGasPrice()),
        maxHops,
        poolProvider,
        // quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
        quoteProvider,
        // blockNumber: () => provider({ chainId: amount.currency.chainId }).getBlockNumber(),
        blockNumber,
        allowedPoolTypes: poolTypes,
      })
      console.timeLog(label, res)
      console.timeEnd(label)
      return res
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  )

  return {
    refresh,
    trade,
    isLoading: isLoading || loading,
    isStale: trade?.blockNumber !== blockNumber,
    syncing: syncing || isValidating || (amount?.quotient.toString() !== deferQuotient && deferQuotient !== undefined),
  }
}

export function useBestAMMTradeFromQuoter({ amount, baseCurrency, currency, tradeType, maxHops, maxSplits }: Options) {
  // const gasPrice = useGasPrice()
  const blockNumber = useCurrentBlock()
  const {
    refresh,
    pools: candidatePools,
    loading,
    syncing,
  } = useCommonPools(baseCurrency || amount?.currency, currency, { blockNumber })
  // const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
  const deferQuotientRaw = useDeferredValue(amount?.quotient.toString())
  const deferQuotient = useDebounce(deferQuotientRaw, 150)
  const {
    data: trade,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    amount && currency && candidatePools && !loading
      ? [currency.chainId, amount.currency.symbol, currency.symbol, tradeType, deferQuotient, maxHops, maxSplits]
      : null,
    async () => {
      if (!deferQuotient) {
        return null
      }
      const label = '[METRIC] Get best AMM trade'
      console.time(label)
      console.timeLog(
        label,
        'Start',
        currency.chainId,
        amount.currency.symbol,
        currency.symbol,
        tradeType,
        deferQuotient,
        candidatePools,
      )
      const res = await SmartRouter.getBestTrade(amount, currency, tradeType, {
        gasPriceWei: async () => JSBI.BigInt(await provider({ chainId: amount.currency.chainId }).getGasPrice()),
        maxHops,
        poolProvider: SmartRouter.createPoolProvider({ onChainProvider: provider }),
        quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
        blockNumber,
      })
      console.timeLog(label, res)
      console.timeEnd(label)
      return res
    },
    {
      revalidateOnFocus: false,
    },
  )

  useEffect(() => {
    // Revalidate if pools updated
    mutate()
    // eslint-disable-next-line
  }, [candidatePools])

  return {
    refresh,
    trade,
    isLoading: isLoading || loading,
    syncing: syncing || isValidating,
  }
}
