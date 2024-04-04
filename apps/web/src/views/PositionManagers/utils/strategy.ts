import { TranslateFunction } from '@pancakeswap/localization'
import { Strategy } from '@pancakeswap/position-managers'

export function getStrategyName(t: TranslateFunction, strategy: Strategy, allTokenName?: string) {
  switch (strategy) {
    case Strategy.TYPICAL_WIDE:
      return 'Typical Wide'
    case Strategy.YIELD_IQ:
      return 'Yield IQ'
    case Strategy.ACTIVE:
      return 'Active'
    case Strategy.PASSIVE:
      return 'Passive'
    case Strategy.PEGGED:
      return 'Pegged'
    case Strategy.ALO:
      return 'Automated Liquidity Optimization'
    case Strategy.ASCEND:
      return 'Ascend'
    case Strategy.SAVINGS:
      return `${allTokenName ? `${allTokenName} ` : ''}${'Savings'}`
    default:
      return ''
  }
}
