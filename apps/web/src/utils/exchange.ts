import { Trade } from '@pancakeswap/router-sdk'
import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, TradeType, ZERO_PERCENT } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import IPancakeRouter02ABI from 'config/abi/IPancakeRouter02.json'
import { IPancakeRouter02 } from 'config/abi/types/IPancakeRouter02'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BIPS_BASE,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  INPUT_FRACTION_AFTER_FEE,
  ONE_HUNDRED_PERCENT,
  ROUTER_ADDRESS,
} from 'config/constants/exchange'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract } from 'hooks/useContract'
import { StableTrade } from 'views/Swap/StableSwap/hooks/useStableTradeExactIn'
import { Field } from '../state/swap/actions'

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), BIPS_BASE)
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

export function useRouterContract() {
  const { chainId } = useActiveChainId()
  return useContract<IPancakeRouter02>(ROUTER_ADDRESS[chainId], IPancakeRouter02ABI, true)
}

function getPoolFee(currentFee: Percent, pool): Percent {
  const fee =
    pool instanceof Pair
      ? // not currently possible given protocol check above, but not fatal
        FeeAmount.MEDIUM
      : pool.fee
  return currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(fee, 1_000_000)))
}

// computes realized lp fee as a percent
export function computeRealizedLPFeePercent(trade: Trade<Currency, Currency, TradeType>): Percent {
  let percent: Percent

  // Since routes are either all v2 or all v3 right now, calculate separately
  if (trade.swaps[0].route.pools instanceof Pair) {
    // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
    // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.swaps.reduce<Percent>(
        (currentFee: Percent): Percent => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT,
      ),
    )
  } else {
    percent = ZERO_PERCENT
    for (const swap of trade.swaps) {
      const { numerator, denominator } = swap.inputAmount.divide(trade.inputAmount)
      const overallPercent = new Percent(numerator, denominator)

      const poolFee = swap.route.pools.reduce<Percent>(getPoolFee, ONE_HUNDRED_PERCENT)

      const routeRealizedLPFeePercent = overallPercent.multiply(ONE_HUNDRED_PERCENT.subtract(poolFee))

      percent = percent.add(routeRealizedLPFeePercent)
    }
  }

  return new Percent(percent.numerator, percent.denominator)
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade: Trade<Currency, Currency, TradeType> | null): {
  priceImpactWithoutFee: Percent | undefined
  realizedLPFee: CurrencyAmount<Currency> | undefined | null
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = computeRealizedLPFeePercent(trade ?? undefined)

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade?.priceImpact.subtract(realizedLPFee) : undefined

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

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips

export function computeSlippageAdjustedAmounts(
  trade: Trade<Currency, Currency, TradeType> | StableTrade | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  }
}

export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

export function formatExecutionPrice(
  trade?: Trade<Currency, Currency, TradeType> | StableTrade,
  inverted?: boolean,
): string {
  if (!trade) {
    return ''
  }
  return inverted
    ? `${trade.executionPrice.invert().toSignificant(6)} ${trade.inputAmount.currency.symbol} / ${
        trade.outputAmount.currency.symbol
      }`
    : `${trade.executionPrice.toSignificant(6)} ${trade.outputAmount.currency.symbol} / ${
        trade.inputAmount.currency.symbol
      }`
}
