import { Currency, CurrencyAmount, Fraction, Percent, Price, TradeType, ZERO_PERCENT } from '@pancakeswap/sdk'

import { parseUnits } from 'viem'
import { ONE_HUNDRED_PERCENT } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { mmLinkedPoolABI } from 'config/abi/mmLinkedPool'
import { useContract } from 'hooks/useContract'
import toNumber from 'lodash/toNumber'
import { Address } from 'wagmi'
import { Field } from 'state/swap/actions'
import { MM_STABLE_TOKENS_WHITE_LIST, MM_SWAP_CONTRACT_ADDRESS, NATIVE_CURRENCY_ADDRESS } from '../constants'
import { OrderBookRequest, TradeWithMM } from '../types'

export function useMMSwapContract() {
  const { chainId } = useActiveChainId()
  return useContract(MM_SWAP_CONTRACT_ADDRESS[chainId], mmLinkedPoolABI)
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade?: TradeWithMM<Currency, Currency, TradeType> | null): {
  priceImpactWithoutFee: Percent | undefined
  realizedLPFee: CurrencyAmount<Currency> | undefined | null
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction => currentFee.multiply(ONE_HUNDRED_PERCENT),
          ONE_HUNDRED_PERCENT,
        ),
      )

  const stableList = MM_STABLE_TOKENS_WHITE_LIST[trade?.inputAmount?.currency?.chainId]
  const isStablePair = Boolean(
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

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(trade: TradeWithMM<Currency, Currency, TradeType> | undefined): {
  [field in Field]?: CurrencyAmount<Currency>
} {
  return {
    [Field.INPUT]: trade?.inputAmount,
    [Field.OUTPUT]: trade?.outputAmount,
  }
}

function executionPrice<TIn extends Currency, TOut extends Currency, TTradeType extends TradeType>({
  inputAmount,
  outputAmount,
}: TradeWithMM<TIn, TOut, TTradeType>) {
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}

export function formatExecutionPrice(trade?: TradeWithMM<Currency, Currency, TradeType>, inverted?: boolean): string {
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
  inputCurrency?: Currency,
  outputCurrency?: Currency,
  independentField?: Field,
  typedValue?: `${number}`,
  account?: Address,
  isForRFQ?: boolean,
): OrderBookRequest => {
  if (!chainId || !inputCurrency || !outputCurrency || !outputCurrency || !independentField || !typedValue) return null
  return {
    networkId: chainId,
    takerSideToken: inputCurrency?.isToken
      ? inputCurrency.address
      : isForRFQ // RFQ needs native address and order book use WETH to get quote
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
  inputCurrency?: Currency,
  outputCurrency?: Currency,
  takerSideTokenAmount?: string,
  makerSideTokenAmount?: string,
): TradeWithMM<Currency, Currency, TradeType> => {
  if (!inputCurrency || !outputCurrency || !takerSideTokenAmount || !makerSideTokenAmount) return null
  const bestTradeWithMM: TradeWithMM<Currency, Currency, TradeType> = {
    tradeType: isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    inputAmount: CurrencyAmount.fromRawAmount(inputCurrency, BigInt(takerSideTokenAmount)),
    outputAmount: CurrencyAmount.fromRawAmount(outputCurrency, BigInt(makerSideTokenAmount)),
    route: {
      input: inputCurrency,
      output: outputCurrency,
      pairs: [],
      path: [inputCurrency, outputCurrency],
    },
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
