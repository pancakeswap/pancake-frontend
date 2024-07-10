import { BigintIsh, Currency, sortCurrencies } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { NoTickDataProvider, Tick, TickConstructorArgs, TickDataProvider, TickListDataProvider } from '../entities'

export type PoolState = {
  currency0: Currency
  currency1: Currency
  fee: number
  tickCurrent: number
  tickSpacing: number
  sqrtRatioX96: bigint
  liquidity: bigint
  tickDataProvider: TickDataProvider
}

/**
 * By default, pools will not allow operations that require ticks.
 */
const NO_TICK_DATA_PROVIDER_DEFAULT = new NoTickDataProvider()
const MAX_FEE_AMOUNT = 1_000_000n

export const getPool = ({
  currencyA,
  currencyB,
  fee,
  sqrtRatioX96,
  liquidity,
  tickCurrent,
  tickSpacing,
  ticks = NO_TICK_DATA_PROVIDER_DEFAULT,
}: {
  currencyA: Currency
  currencyB: Currency
  fee: number
  sqrtRatioX96: BigintIsh
  liquidity: BigintIsh
  tickCurrent: number
  tickSpacing: number
  ticks?: TickDataProvider | (Tick | TickConstructorArgs)[]
}): PoolState => {
  invariant(Number.isInteger(fee) && BigInt(fee) < MAX_FEE_AMOUNT, 'FEE')

  const [currency0, currency1] = sortCurrencies([currencyA, currencyB])

  return {
    currency0,
    currency1,
    fee,
    tickCurrent,
    tickSpacing,
    sqrtRatioX96: BigInt(sqrtRatioX96),
    liquidity: BigInt(liquidity),
    tickDataProvider: Array.isArray(ticks) ? new TickListDataProvider(ticks) : ticks,
  }
}
