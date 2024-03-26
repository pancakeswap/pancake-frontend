import { Currency, CurrencyAmount, Fraction, Percent, Price, TradeType, ZERO_PERCENT } from '@pancakeswap/sdk'

import { RouteType, SmartRouterTrade } from '@pancakeswap/smart-router'
import { mmLinkedPoolABI } from 'config/abi/mmLinkedPool'
import { BIG_INT_ZERO, ONE_HUNDRED_PERCENT } from 'config/constants/exchange'
import { UnsafeCurrency } from 'config/constants/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract } from 'hooks/useContract'
import toNumber from 'lodash/toNumber'
import { Field } from 'state/swap/actions'
import { parseUnits } from 'viem'
import { Address } from 'wagmi'
import { MM_STABLE_TOKENS_WHITE_LIST, MM_SWAP_CONTRACT_ADDRESS, NATIVE_CURRENCY_ADDRESS } from '../constants'
import { OrderBookRequest } from '../types'

export function useMMSwapContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId && MM_SWAP_CONTRACT_ADDRESS[chainId], mmLinkedPoolABI)
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(
  trade?: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount'> | null,
): {
  priceImpactWithoutFee: Percent | undefined
  lpFeeAmount: CurrencyAmount<Currency> | undefined | null
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade ? undefined : ONE_HUNDRED_PERCENT

  const stableList =
    trade?.inputAmount?.currency?.chainId && MM_STABLE_TOKENS_WHITE_LIST[trade?.inputAmount?.currency?.chainId]
  const isStablePair = Boolean(
    stableList &&
      trade?.inputAmount?.currency?.isToken &&
      trade?.outputAmount?.currency?.isToken &&
      stableList[trade?.inputAmount?.currency?.address] &&
      stableList[trade?.outputAmount?.currency?.address],
  )
  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = ZERO_PERCENT

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction ? ZERO_PERCENT : undefined

  // the amount of the input that accrues to LPs
  const feeRate = new Fraction(5, 10000)
  const stableFeeRate = new Fraction(1, 10000)
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    (isStablePair ? trade.inputAmount.multiply(stableFeeRate) : trade.inputAmount.multiply(feeRate))

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, lpFeeAmount: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount'> | undefined | null,
): {
  [field in Field]?: CurrencyAmount<Currency>
} {
  return {
    [Field.INPUT]: trade?.inputAmount,
    [Field.OUTPUT]: trade?.outputAmount,
  }
}

function executionPrice<TTradeType extends TradeType>({
  inputAmount,
  outputAmount,
}: Pick<SmartRouterTrade<TTradeType>, 'inputAmount' | 'outputAmount'>) {
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}

export function formatExecutionPrice(
  trade?: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount'>,
  inverted?: boolean,
): string {
  if (!trade) {
    return ''
  }
  return inverted
    ? `${executionPrice(trade).invert().toSignificant(6)} ${trade.inputAmount.currency.symbol} / ${
        trade.outputAmount.currency.symbol
      }`
    : `${executionPrice(trade).toSignificant(6)} ${trade.outputAmount.currency.symbol} / ${
        trade.inputAmount.currency.symbol
      }`
}

export const tryParseUnit = (typedValue?: `${number}`, decimals?: number) => {
  let parseAmountString: string | undefined
  if (!typedValue || !decimals) return parseAmountString
  try {
    parseAmountString = parseUnits(typedValue, decimals).toString()
  } catch {
    parseAmountString = parseUnits(`${toNumber(typedValue).toFixed(decimals)}` as `${number}`, decimals).toString()
  }
  return parseAmountString
}

export const parseMMParameter = (
  chainId?: number,
  inputCurrency?: UnsafeCurrency,
  outputCurrency?: UnsafeCurrency,
  independentField?: Field,
  typedValue?: `${number}`,
  account?: Address,
  isForRFQ?: boolean,
): OrderBookRequest | null => {
  if (!chainId || !inputCurrency || !outputCurrency || !outputCurrency || !independentField || !typedValue) return null
  return {
    networkId: chainId,
    takerSideToken: inputCurrency?.isToken
      ? inputCurrency.address
      : isForRFQ // RFQ needs native address and order book use WNATIVE to get quote
      ? NATIVE_CURRENCY_ADDRESS
      : inputCurrency.wrapped.address,
    makerSideToken: outputCurrency?.isToken
      ? outputCurrency.address
      : isForRFQ
      ? NATIVE_CURRENCY_ADDRESS
      : outputCurrency.wrapped.address,
    takerSideTokenAmount:
      independentField === Field.INPUT && typedValue && typedValue !== '0'
        ? tryParseUnit(typedValue, inputCurrency.decimals)
        : undefined,
    makerSideTokenAmount:
      independentField === Field.OUTPUT && typedValue && typedValue !== '0'
        ? tryParseUnit(typedValue, outputCurrency?.decimals)
        : undefined,
    trader: account ?? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // need a default address for API
  }
}

export const parseMMTrade = (
  isExactIn,
  inputCurrency?: UnsafeCurrency,
  outputCurrency?: UnsafeCurrency,
  takerSideTokenAmount?: string,
  makerSideTokenAmount?: string,
): SmartRouterTrade<TradeType> | null => {
  if (!inputCurrency || !outputCurrency || !takerSideTokenAmount || !makerSideTokenAmount) return null
  const bestTradeWithMM: SmartRouterTrade<TradeType> = {
    tradeType: isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    inputAmount: CurrencyAmount.fromRawAmount(inputCurrency, BigInt(takerSideTokenAmount)),
    outputAmount: CurrencyAmount.fromRawAmount(outputCurrency, BigInt(makerSideTokenAmount)),
    routes: [
      {
        inputAmount: CurrencyAmount.fromRawAmount(inputCurrency, BigInt(takerSideTokenAmount)),
        outputAmount: CurrencyAmount.fromRawAmount(outputCurrency, BigInt(makerSideTokenAmount)),
        type: RouteType.MM,
        pools: [],
        percent: 100,
        path: [inputCurrency, outputCurrency],
      },
    ],
    gasEstimate: BIG_INT_ZERO,
    gasEstimateInUSD: undefined,
  }
  return bestTradeWithMM
}

export const shouldShowMMSpecificError = (message?: string) => {
  if (message?.includes('Amount is below')) return true
  if (message?.includes('Amount is above')) return true
  return false
}

export const shouldShowMMLiquidityError = (message?: string) => {
  if (message?.includes('not found')) return true
  return false
}

export const parseMMError = (message?: string) => {
  if (message?.includes('Amount is below')) {
    return `Minimum Amount (~$30) to trade with MM: ${
      Math.ceil(toNumber(message.split(':')?.[1] ?? 0) * 1000) / 1000 ?? ''
    }`
  }
  if (message?.includes('Amount is above')) {
    return `Maximum Amount to trade with MM: ${toNumber(message.split(':')?.[1] ?? 0).toFixed(3) ?? ''}`
  }
  if (message?.includes('insufficient_liquidity')) {
    return `MM insufficient liquidity`
  }
  return message
}
