import { TranslateFunction } from '@pancakeswap/localization'
import { ManagerFeeType } from '@pancakeswap/position-managers'

export function getReadableManagerFeeType(t: TranslateFunction, feeType: ManagerFeeType) {
  switch (feeType) {
    case ManagerFeeType.LP_REWARDS:
      return t('% of LP rewards')
    default:
      return ''
  }
}
