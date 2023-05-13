import {
  ONE_HUNDRED_PERCENT,
  Trade,
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
  TradeType,
} from '@pancakeswap/aptos-swap-sdk'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BIPS_BASE,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  INPUT_FRACTION_AFTER_FEE,
} from 'config/constants/exchange'
import { Field } from 'state/swap'

// TODO: aptos merge with exchange
export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade?: Trade<Currency, Currency, TradeType> | null): {
  priceImpactWithoutFee: Percent | undefined
  realizedLPFee: CurrencyAmount<Currency> | undefined | null
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT,
        ),
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    CurrencyAmount.fromRawAmount(
      trade.inputAmount.currency,
      realizedLPFee.multiply(trade.inputAmount.quotient).quotient,
    )

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(BigInt(num), BIPS_BASE)
}

export function computeSlippageAdjustedAmounts(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  }
}

export function calculateSlippageAmount(value: CurrencyAmount<Currency>, slippage: number): [bigint, bigint] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    (value.quotient * BigInt(10000 - slippage)) / BIPS_BASE,
    (value.quotient * BigInt(10000 + slippage)) / BIPS_BASE,
  ]
}
