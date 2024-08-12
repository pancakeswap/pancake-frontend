import { useTranslation } from '@pancakeswap/localization'
import { Currency, Price, Token } from '@pancakeswap/swap-sdk-core'
import { IconButton, SwapHorizIcon } from '@pancakeswap/uikit'
import { Bound } from '@pancakeswap/widgets-internal'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { memo, useCallback, useState } from 'react'

type PriceRangeProps = {
  currency0: Currency
  currency1: Currency
  priceUpper?: Price<Token, Token>
  priceLower?: Price<Token, Token>
  tickAtLimit: {
    LOWER?: boolean
    UPPER?: boolean
  }
}

export const PriceRange = memo(({ currency1, currency0, priceLower, priceUpper, tickAtLimit }: PriceRangeProps) => {
  const [priceBaseInvert, setPriceBaseInvert] = useState(false)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const toggleSwitch: React.MouseEventHandler<HTMLOrSVGElement> = useCallback(
    (e) => {
      e.preventDefault()
      setPriceBaseInvert(!priceBaseInvert)
    },
    [priceBaseInvert],
  )

  return priceUpper && priceLower ? (
    <>
      {t('Min %minAmount%', {
        minAmount: formatTickPrice(
          priceBaseInvert ? priceUpper.invert() : priceLower,
          tickAtLimit,
          Bound.LOWER,
          locale,
        ),
      })}{' '}
      /{' '}
      {t('Max %maxAmount%', {
        maxAmount: formatTickPrice(
          priceBaseInvert ? priceLower.invert() : priceUpper,
          tickAtLimit,
          Bound.UPPER,
          locale,
        ),
      })}{' '}
      {t('of %assetA% per %assetB%', {
        assetA: priceBaseInvert ? currency1.symbol : currency0.symbol,
        assetB: priceBaseInvert ? currency0.symbol : currency1.symbol,
      })}
      <IconButton onClick={toggleSwitch} variant="text" scale="xs">
        <SwapHorizIcon color="textSubtle" ml="2px" />
      </IconButton>
    </>
  ) : null
})
