import * as Sentry from '@sentry/nextjs'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, Price, Token } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { AutoColumn, BunnyKnownPlaceholder, ChartDisableIcon, LineGraphIcon } from '@pancakeswap/uikit'
import { format } from 'd3'
import { saturate } from 'polished'
import { useCallback, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { Bound } from 'config/constants/types'
import { InfoBox } from 'components/InfoBox'

import { Chart } from './Chart'
import { useDensityChartData } from './hooks'
import { ZoomLevels, ZOOM_LEVELS } from './types'
import Loader from './Loader'

const ChartWrapper = styled.div`
  position: relative;

  justify-content: center;
  align-content: center;
`

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
  onBothRangeInput,
  zoomLevel,
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  feeAmount?: FeeAmount
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
  price: number | undefined
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  onBothRangeInput: ({ leftTypedValue, rightTypedValue }: { leftTypedValue: string; rightTypedValue: string }) => void
  interactive: boolean
  zoomLevel?: ZoomLevels
}) {
  const { t } = useTranslation()
  const theme = useTheme()

  // Get token color
  const tokenAColor = '#7645D9'
  const tokenBColor = '#7645D9'

  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped)

  const { isLoading, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
  })

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0])
      const rightRangeValue = Number(domain[1])

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6
      }

      const updateLeft =
        (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] || mode === 'handle' || mode === 'reset') &&
        leftRangeValue > 0

      const updateRight =
        (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === 'reset') &&
        rightRangeValue > 0 &&
        rightRangeValue < 1e35

      if (updateLeft && updateRight) {
        const parsedLeftRangeValue = parseFloat(leftRangeValue.toFixed(6))
        const parsedRightRangeValue = parseFloat(rightRangeValue.toFixed(6))
        if (parsedLeftRangeValue > 0 && parsedRightRangeValue > 0 && parsedLeftRangeValue < parsedRightRangeValue) {
          onBothRangeInput({
            leftTypedValue: leftRangeValue.toFixed(6),
            rightTypedValue: rightRangeValue.toFixed(6),
          })
        }
      } else if (updateLeft) {
        onLeftRangeInput(leftRangeValue.toFixed(6))
      } else if (updateRight) {
        onRightRangeInput(rightRangeValue.toFixed(6))
      }
    },
    [isSorted, onBothRangeInput, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
  )

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert()
    const rightPrice = isSorted ? priceUpper : priceLower?.invert()

    return leftPrice && rightPrice
      ? [parseFloat(leftPrice?.toSignificant(6)), parseFloat(rightPrice?.toSignificant(6))]
      : undefined
  }, [isSorted, priceLower, priceUpper])

  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) return ''

      if (d === 'w' && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) return '0'
      if (d === 'e' && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) return '∞'

      const percent = (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100

      return price ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%` : ''
    },
    [isSorted, price, ticksAtLimit],
  )

  if (error) {
    Sentry.captureMessage(error.toString(), 'log')
  }

  const isUninitialized = !currencyA || !currencyB || (formattedData === undefined && !isLoading)

  return (
    <AutoColumn gap="md" style={{ minHeight: '200px', width: '100%', marginBottom: '16px' }}>
      {isUninitialized ? (
        <InfoBox message={t('Your position will appear here.')} icon={<BunnyKnownPlaceholder />} />
      ) : isLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={theme.colors.text} />} />
      ) : error ? (
        <InfoBox message={t('Liquidity data not available.')} icon={<ChartDisableIcon width="40px" />} />
      ) : !formattedData || formattedData.length === 0 || !price ? (
        <InfoBox message={t('There is no liquidity data.')} icon={<LineGraphIcon width="40px" />} />
      ) : (
        <ChartWrapper>
          <Chart
            key={`${feeAmount ?? FeeAmount.MEDIUM}`}
            data={{ series: formattedData, current: price }}
            dimensions={{ width: 400, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: theme.colors.text,
              },
              brush: {
                handle: {
                  west: saturate(0.1, tokenAColor) ?? theme.colors.text,
                  east: saturate(0.1, tokenBColor) ?? theme.colors.text,
                },
              },
            }}
            interactive={interactive && Boolean(formattedData?.length)}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={zoomLevel ?? ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        </ChartWrapper>
      )}
    </AutoColumn>
  )
}
