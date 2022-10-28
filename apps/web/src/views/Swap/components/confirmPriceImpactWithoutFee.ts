import { Percent } from '@pancakeswap/sdk'
import { ContextApi } from '@pancakeswap/localization'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from 'config/constants/exchange'

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 * @param t Translation
 */
export default function confirmPriceImpactWithoutFee(priceImpactWithoutFee: Percent, t: ContextApi['t']): boolean {
  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    const confirmWord = 'confirm'
    return (
      // eslint-disable-next-line no-alert
      window.prompt(
        t(
          'This swap has a price impact of at least %amount%%. Please type the word "%word%" to continue with this swap.',
          {
            amount: PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(0),
            word: confirmWord,
          },
        ),
      ) === confirmWord
    )
  }
  if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
    // eslint-disable-next-line no-alert
    return window.confirm(
      t(
        'This swap has a price impact of at least %amount%%. Please confirm that you would like to continue with this swap.',
        {
          amount: ALLOWED_PRICE_IMPACT_HIGH.toFixed(0),
        },
      ),
    )
  }
  return true
}
