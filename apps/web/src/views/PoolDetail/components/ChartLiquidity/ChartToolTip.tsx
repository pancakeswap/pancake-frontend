import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { AutoColumn, RowBetween, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import useTheme from 'hooks/useTheme'
import React, { useMemo } from 'react'
import { styled } from 'styled-components'
import { formatAmount } from 'utils/formatInfoNumbers'

const TooltipWrapper = styled(LightCard)`
  width: 260px;
  padding: 12px;
  opacity: 0.6;
  font-size: 12px;
  z-index: 10;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 320px;
  }
`

interface CustomToolTipProps {
  currency0?: Currency
  currency1?: Currency
  price0?: `${number}`
  price1?: `${number}`
  tvlToken0?: number
  tvlToken1?: number
  currentPrice: number | undefined
}

export const ChartToolTip: React.FC<CustomToolTipProps> = ({
  price0,
  price1,
  tvlToken0,
  tvlToken1,
  currentPrice,
  currency0,
  currency1,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const symbol0 = useMemo(() => currency0?.symbol, [currency0])
  const symbol1 = useMemo(() => currency1?.symbol, [currency1])

  return (
    <TooltipWrapper>
      <AutoColumn gap="sm">
        <Text color={theme.colors.textSubtle}>{t('Tick stats')}</Text>
        <RowBetween>
          <Text>
            {symbol0} {t('Price')}:{' '}
          </Text>
          <Text>
            {price0
              ? Number(price0).toLocaleString(undefined, {
                  minimumSignificantDigits: 1,
                })
              : ''}{' '}
            {symbol1}
          </Text>
        </RowBetween>
        <RowBetween>
          <Text>
            {symbol1} {t('Price')}:{' '}
          </Text>
          <Text>
            {price1
              ? Number(price1).toLocaleString(undefined, {
                  minimumSignificantDigits: 1,
                })
              : ''}{' '}
            {symbol0}
          </Text>
        </RowBetween>
        {currentPrice && price0 && currentPrice > Number(price1) ? (
          <RowBetween>
            <Text>
              {symbol0} {t('Locked')}:{' '}
            </Text>
            <Text>
              {tvlToken0 ? formatAmount(tvlToken0) : ''} {symbol0}
            </Text>
          </RowBetween>
        ) : (
          <RowBetween>
            <Text>
              {symbol1} {t('Locked')}:{' '}
            </Text>
            <Text>
              {tvlToken1 ? formatAmount(tvlToken1) : ''} {symbol1}
            </Text>
          </RowBetween>
        )}
      </AutoColumn>
    </TooltipWrapper>
  )
}
