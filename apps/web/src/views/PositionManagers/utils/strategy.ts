import { TranslateFunction } from '@pancakeswap/localization'
import { Strategy } from '@pancakeswap/position-managers'

export function getStrategyName(t: TranslateFunction, strategy: Strategy) {
  switch (strategy) {
    case Strategy.TYPICAL_WIDE:
      return t('Typical Wide')
    case Strategy.SUPER_ONE_SIDED:
      return t('Yield IQ')
    default:
      return ''
  }
}
