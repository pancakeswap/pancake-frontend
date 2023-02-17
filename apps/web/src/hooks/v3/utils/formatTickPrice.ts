import { Price, Token } from '@pancakeswap/sdk'
import { formatPrice } from 'utils/formatCurrencyAmount'
import { Bound } from 'views/AddLiquidityV3/form/actions'

export function formatTickPrice(
  price: Price<Token, Token> | undefined,
  atLimit: { [bound in Bound]?: boolean | undefined },
  direction: Bound,
  locale: string,
  placeholder?: string,
) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? '0' : '∞'
  }

  if (!price && placeholder !== undefined) {
    return placeholder
  }

  return formatPrice(price, 5, locale)
}
