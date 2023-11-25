import { TranslateFunction } from '@pancakeswap/localization'
import { Strategy } from '@pancakeswap/position-managers'

export function getStrategyName(t: TranslateFunction, strategy: Strategy) {
  switch (strategy) {
    case Strategy.TYPICAL_WIDE:
      return t('Typical Wide')
    case Strategy.YIELD_IQ:
      return t('Yield IQ')
    case Strategy.ACTIVE:
      return t('Active')
    case Strategy.PASSIVE:
      return t('Passive')
    case Strategy.PEGGED:
      return t('Pegged')
    default:
      return ''
  }
}
