import { Currency, CurrencyAmount, Fraction, JSBI, Percent, Price, TradeType, ZERO_PERCENT } from '@pancakeswap/sdk'

import { getAddress } from '@ethersproject/address'
import { parseUnits } from '@ethersproject/units'
import PancakeSwapMMLinkedPoolABI from 'config/abi/mmLinkedPool.json'
import { MmLinkedPool } from 'config/abi/types/MmLinkedPool'
import { BIPS_BASE, ONE_HUNDRED_PERCENT } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract } from 'hooks/useContract'
import toNumber from 'lodash/toNumber'
import { Field } from 'state/swap/actions'
import { basisPointsToPercent } from 'utils/exchange'
import { MM_SWAP_CONTRACT_ADDRESS } from '../constants'
import { OrderBookRequest, TradeWithMM } from '../types'

const NATIVE_CURRENCY_ADDRESS = getAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')

export function useMMSwapContract() {
  const { chainId } = useActiveChainId()
  return useContract<MmLinkedPool>(MM_SWAP_CONTRACT_ADDRESS[chainId], PancakeSwapMMLinkedPoolABI, true)
}

export function calculateSlippageAmount(value: CurrencyAmount<Currency>, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.quotient, JSBI.BigInt(10000 - slippage)), BIPS_BASE),
    JSBI.divide(JSBI.multiply(value.quotient, JSBI.BigInt(10000 + slippage)), BIPS_BASE),
  ]
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
          (currentFee: Fraction, pair): Fraction => currentFee.multiply(ONE_HUNDRED_PERCENT),
          ONE_HUNDRED_PERCENT,
        ),
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = ZERO_PERCENT

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction ? ZERO_PERCENT : undefined

  // the amount of the input that accrues to LPs
  const feeRate = new Fraction(5, 10000)
  const realizedLPFeeAmount = realizedLPFee && trade && trade.inputAmount.multiply(feeRate)

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: TradeWithMM<Currency, Currency, TradeType> | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade.inputAmount,
    [Field.OUTPUT]: trade.outputAmount,
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

export const tryParseUnit = (typedValue?: string, decimals?: number) => {
  let parseAmountString
  if (!typedValue || !decimals) return parseAmountString
  try {
    parseAmountString = parseUnits(typedValue, decimals).toString()
  } catch {
    parseAmountString = parseUnits(toNumber(typedValue).toFixed(decimals), decimals).toString()
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return parseAmountString
  }
}

export const parseMMParameter = (
  chainId: number,
  inputCurrency: Currency,
  outputCurrency: Currency,
  independentField: Field,
  typedValue: string,
  account: string,
): OrderBookRequest => {
  return {
    networkId: chainId,
    takerSideToken: inputCurrency?.isToken ? inputCurrency.address : NATIVE_CURRENCY_ADDRESS,
    makerSideToken: outputCurrency?.isToken ? outputCurrency.address : NATIVE_CURRENCY_ADDRESS,
    takerSideTokenAmount:
      independentField === Field.INPUT && typedValue && typedValue !== '0'
        ? tryParseUnit(typedValue, inputCurrency.decimals)
        : undefined,
    makerSideTokenAmount:
      independentField === Field.OUTPUT && typedValue && typedValue !== '0'
        ? tryParseUnit(typedValue, outputCurrency?.decimals)
        : undefined,
    trader: account,
  }
}

export const parseMMTrade = (
  isExactIn,
  inputCurrency: Currency,
  outputCurrency: Currency,
  takerSideTokenAmount: string,
  makerSideTokenAmount: string,
): TradeWithMM<Currency, Currency, TradeType> => {
  const bestTradeWithMM: TradeWithMM<Currency, Currency, TradeType> = {
    tradeType: isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    inputAmount: CurrencyAmount.fromRawAmount(inputCurrency, JSBI.BigInt(takerSideTokenAmount)),
    outputAmount: CurrencyAmount.fromRawAmount(outputCurrency, JSBI.BigInt(makerSideTokenAmount)),
    route: {
      input: inputCurrency,
      output: outputCurrency,
      pairs: [],
      path: [inputCurrency, outputCurrency],
    },
  }
  return bestTradeWithMM
}

export const shouldShowMMError = (message?: string) => {
  if (message?.includes('Amount is below')) return true
  if (message?.includes('Amount is above')) return true
  return false
}

export const parseMMError = (message?: string) => {
  if (message?.includes('Amount is below')) {
    return `Minimum Amount(~$30$) to trade with MM:${message.split(':')?.[1] ?? ''}`
  }
  if (message?.includes('Amount is below')) {
    return `Maximum Amount to trade with MM:${message.split(':')?.[1] ?? ''}`
  }
  return message
}
