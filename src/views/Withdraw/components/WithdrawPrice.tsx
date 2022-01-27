import React from 'react'
import { Price } from 'peronio-sdk'
import { Text, AutoRenewIcon } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import { StyledBalanceMaxMini } from './styleds'

interface WithdrawPriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function WithdrawPrice({ price, showInverted, setShowInverted }: WithdrawPriceProps) {
  const { t } = useTranslation()

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = t(showInverted ? '%quoteSymbol% per %baseSymbol%' : '%baseSymbol% per %quoteSymbol%', {
    quoteSymbol: price?.quoteCurrency?.symbol,
    baseSymbol: price?.baseCurrency?.symbol,
  })

  return (
    <Text style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <AutoRenewIcon width="14px" />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
