import { TranslateFunction } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'

export enum PercentageDirection {
  ABOVE = 'above',
  BELOW = 'below',
  MARKET = 'market',
}

export const getRatePercentageMessage = (
  t: TranslateFunction,
  percentageRateDifference?: Percent,
): [string | null, PercentageDirection | null] => {
  if (percentageRateDifference) {
    if (percentageRateDifference.equalTo(0)) {
      return [t('at market price'), PercentageDirection.MARKET]
    }
    const percentageAsString = percentageRateDifference.toSignificant(6)
    const formattedPercentage = parseFloat(percentageAsString).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    if (percentageRateDifference.lessThan('0')) {
      return [t('%percentage%% below market', { percentage: formattedPercentage }), PercentageDirection.BELOW]
    }
    return [t('%percentage%% above market', { percentage: formattedPercentage }), PercentageDirection.ABOVE]
  }
  return [null, null]
}
