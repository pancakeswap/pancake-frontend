import { TranslateFunction } from '@pancakeswap/localization'
import { Strategy } from '@pancakeswap/position-managers'

export function getStrategyName(t: TranslateFunction, strategy: Strategy, allTokenName?: string) {
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
    case Strategy.ALO:
      return t('Automated Liquidity Optimization')
    case Strategy.ASCEND:
      return t('Ascend')
    case Strategy.SSS:
      return t('Single-Sided Strategy')
    case Strategy.APS:
      return t('Adaptive Portfolio Strategy')
    case Strategy.SAVINGS:
      return `${allTokenName ? `${allTokenName} ` : ''}${t('Savings')}`
    default:
      return ''
  }
}
