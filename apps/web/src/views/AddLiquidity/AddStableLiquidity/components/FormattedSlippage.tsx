import { Percent, Rounding } from '@pancakeswap/sdk'

import CircleLoader from 'components/Loader/CircleLoader'
import { ONE_BIPS } from 'config/constants/exchange'
import { ErrorText } from 'views/Swap/components/styleds'
import { warningSeverity } from '../utils/slippage'

/**
 * Formatted version of price impact text with warning colors
 */
export function FormattedSlippage({ slippage, loading = false }: { slippage?: Percent; loading?: boolean }) {
  const slippageDisplay = slippage
    ? slippage.lessThan(ONE_BIPS) || slippage.equalTo(0)
      ? '<0.01%'
      : `${slippage.toFixed(2, { groupSeparator: '' }, Rounding.ROUND_DOWN)}%`
    : '-'

  const text = loading ? <CircleLoader /> : slippageDisplay
  return (
    <ErrorText fontSize="14px" severity={slippage ? warningSeverity(slippage) : 0}>
      {text}
    </ErrorText>
  )
}
