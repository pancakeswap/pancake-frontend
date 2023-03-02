import { Currency, CurrencyAmount, Fraction, JSBI, Percent, TradeType, ChainId } from '@pancakeswap/sdk'
import { TradeWithStableSwap, Trade, isStableSwapPair } from '@pancakeswap/smart-router/evm'

import { BIPS_BASE, INPUT_FRACTION_AFTER_FEE, ONE_HUNDRED_PERCENT } from 'config/constants/exchange'
import { Field } from 'state/swap/actions'
import { basisPointsToPercent } from 'utils/exchange'
import PancakeSwapSmartRouterABI from 'config/abi/pancakeSwapSmartRouter.json'
import { PancakeSwapSmartRouter } from 'config/abi/types/PancakeSwapSmartRouter'
import { useContract } from 'hooks/useContract'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainMap } from 'config/constants/types'

export const SMART_ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GOERLI]: '',
  [ChainId.BSC]: '0x64D74e1EAAe3176744b5767b93B7Bee39Cf7898F',
  [ChainId.BSC_TESTNET]: '0xCF457465fC0E98a50Bc3E1b3DDAAF1373622f059',
}

export function useSmartRouterContract() {
  const { chainId } = useActiveChainId()
  return useContract<PancakeSwapSmartRouter>(SMART_ROUTER_ADDRESS[chainId], PancakeSwapSmartRouterABI, true)
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
export function computeTradePriceBreakdown(trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null): {
  priceImpactWithoutFee: Percent | undefined
  realizedLPFee: CurrencyAmount<Currency> | undefined | null
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction, pair): Fraction =>
            currentFee.multiply(
              isStableSwapPair(pair) ? ONE_HUNDRED_PERCENT.subtract(pair.fee) : INPUT_FRACTION_AFTER_FEE,
            ),
          ONE_HUNDRED_PERCENT,
        ),
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction =
    trade && realizedLPFee ? Trade.priceImpact(trade).subtract(realizedLPFee) : undefined

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
  trade: TradeWithStableSwap<Currency, Currency, TradeType> | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade && Trade.maximumAmountIn(trade, pct),
    [Field.OUTPUT]: trade && Trade.minimumAmountOut(trade, pct),
  }
}

export function formatExecutionPrice(
  trade?: TradeWithStableSwap<Currency, Currency, TradeType>,
  inverted?: boolean,
): string {
  if (!trade) {
    return ''
  }
  return inverted
    ? `${Trade.executionPrice(trade).invert().toSignificant(6)} ${trade.inputAmount.currency.symbol} / ${
        trade.outputAmount.currency.symbol
      }`
    : `${Trade.executionPrice(trade).toSignificant(6)} ${trade.outputAmount.currency.symbol} / ${
        trade.inputAmount.currency.symbol
      }`
}
