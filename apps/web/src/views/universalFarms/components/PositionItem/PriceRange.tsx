import { useTranslation } from '@pancakeswap/localization'
import { Currency, Price, Token } from '@pancakeswap/swap-sdk-core'
import { IconButton, SwapHorizIcon } from '@pancakeswap/uikit'
import { Bound } from '@pancakeswap/widgets-internal'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { memo, useCallback, useMemo, useState } from 'react'

type PriceRangeProps = {
  quote?: Currency
  base?: Currency
  priceUpper?: Price<Token, Token>
  priceLower?: Price<Token, Token>
  tickAtLimit: {
    LOWER?: boolean
    UPPER?: boolean
  }
}

export const PriceRange = memo(({ base, quote, priceLower, priceUpper, tickAtLimit }: PriceRangeProps) => {
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

  const [baseSymbol, quoteSymbol, priceMin, priceMax] = useMemo(
    () =>
      !priceBaseInvert
        ? [base?.symbol, quote?.symbol, priceLower, priceUpper]
        : [quote?.symbol, base?.symbol, priceUpper?.invert(), priceLower?.invert()],
    [base?.symbol, quote?.symbol, priceLower, priceUpper, priceBaseInvert],
  )

  return priceUpper && priceLower ? (
    <>
      {t('Min %minAmount%', {
        minAmount: formatTickPrice(priceMin, tickAtLimit, Bound.LOWER, locale),
      })}{' '}
      /{' '}
      {t('Max %maxAmount%', {
        maxAmount: formatTickPrice(priceMax, tickAtLimit, Bound.UPPER, locale),
      })}{' '}
      {t('of %quote% per %base%', {
        quote: quoteSymbol,
        base: baseSymbol,
      })}
      <IconButton onClick={toggleSwitch} variant="text" scale="xs">
        <SwapHorizIcon color="textSubtle" ml="2px" />
      </IconButton>
    </>
  ) : null
})
