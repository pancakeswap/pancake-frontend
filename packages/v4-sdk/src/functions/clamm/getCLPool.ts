import { BigintIsh, Currency, sortCurrencies } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { MAX_TICK_SPACING, MIN_TICK_SPACING } from '../../constants'
import { ONE_HUNDRED_PERCENT_FEE } from '../../constants/fee'

export type CLAMMState = {
  currency0: Currency
  currency1: Currency
  tickSpacing: bigint
  fee: bigint
}

export const getCLPool = ({
  currencyA,
  currencyB,
  tickSpacing,
  fee,
}: {
  currencyA: Currency
  currencyB: Currency
  tickSpacing: BigintIsh
  fee: BigintIsh
}): CLAMMState => {
  invariant(
    Number.isInteger(tickSpacing) && BigInt(tickSpacing) <= MAX_TICK_SPACING && BigInt(tickSpacing) >= MIN_TICK_SPACING,
    'TICK_SPACING'
  )

  invariant(Number.isInteger(fee) && BigInt(fee) < ONE_HUNDRED_PERCENT_FEE, 'FEE')

  const [currency0, currency1] = sortCurrencies([currencyA, currencyB])

  return {
    currency0,
    currency1,
    tickSpacing: BigInt(tickSpacing),
    fee: BigInt(fee),
  }
}
