import { Percent } from '@pancakeswap/sdk'
import { Flex, Text } from '@pancakeswap/uikit'
import { ONE_BIPS } from 'config/constants/exchange'
import { warningSeverity } from 'utils/exchange'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact, isX }: { priceImpact?: Percent | null; isX?: boolean }) {
  if (isX) {
    if (priceImpact) {
      return (
        <Flex alignItems="center">
          <Text fontSize="16px" color="positive60" bold>
            0
          </Text>
          <ErrorText ml="4px" fontSize="14px" severity={isX ? 1 : warningSeverity(priceImpact)} strikeThrough>
            {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
          </ErrorText>
        </Flex>
      )
    }
    return (
      <Text fontSize="14px" color="primary">
        0%
      </Text>
    )
  }

  return (
    <ErrorText fontSize="14px" severity={warningSeverity(priceImpact)}>
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
