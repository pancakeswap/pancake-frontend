import { Percent } from '@pancakeswap/sdk'
import { warningSeverity } from 'utils/exchange'
import { ONE_BIPS } from 'config/constants/exchange'
import { ErrorText } from 'views/Swap/components/styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export function FormattedSlippage({ slippage }: { slippage?: Percent }) {
  return (
    <ErrorText fontSize="14px" severity={slippage ? warningSeverity(slippage) : 0}>
      {slippage ? (slippage.lessThan(ONE_BIPS) ? '<0.01%' : `${slippage.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
