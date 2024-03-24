import { useTranslation } from '@pancakeswap/localization'
import { Currency, Price, Token } from '@pancakeswap/sdk'
import { FlexGap } from '@pancakeswap/uikit'
import { priceToClosestTick } from '@pancakeswap/v3-sdk'
import { Bound } from 'config/constants/types'
import { useMemo } from 'react'
import StepCounter from './StepCounter'

// currencyA is the base token
export default function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  tickSpaceLimits,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  getDecrementLower: () => Price<Token, Token> | undefined
  getIncrementLower: () => Price<Token, Token> | undefined
  getDecrementUpper: () => Price<Token, Token> | undefined
  getIncrementUpper: () => Price<Token, Token> | undefined
  onLeftRangeInput: (typedValue: Price<Token, Token> | undefined) => void
  onRightRangeInput: (typedValue: Price<Token, Token> | undefined) => void
  currencyA?: Currency | undefined | null
  currencyB?: Currency | undefined | null
  feeAmount?: number
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
  tickSpaceLimits?: { [bound in Bound]?: number | undefined }
}) {
  const { t } = useTranslation()
  const tokenA = (currencyA ?? undefined)?.wrapped
  const tokenB = (currencyB ?? undefined)?.wrapped
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  const leftValue = useMemo(() => {
    if (ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) return '0'

    if (
      tickSpaceLimits?.[Bound.LOWER] !== undefined &&
      leftPrice &&
      priceToClosestTick(leftPrice) <= tickSpaceLimits[Bound.LOWER]
    ) {
      return '0'
    }

    return leftPrice?.toSignificant(5) ?? ''
  }, [isSorted, leftPrice, tickSpaceLimits, ticksAtLimit])

  const rightValue = useMemo(() => {
    if (ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) return '∞'

    if (
      tickSpaceLimits?.[Bound.LOWER] !== undefined &&
      rightPrice &&
      priceToClosestTick(rightPrice) <= tickSpaceLimits[Bound.LOWER]
    ) {
      return '0'
    }

    if (
      tickSpaceLimits?.[Bound.UPPER] !== undefined &&
      rightPrice &&
      priceToClosestTick(rightPrice) >= tickSpaceLimits[Bound.UPPER]
    ) {
      return '∞'
    }

    return rightPrice?.toSignificant(5) ?? ''
  }, [isSorted, rightPrice, tickSpaceLimits, ticksAtLimit])

  return (
    <FlexGap gap="16px" width="100%">
      <StepCounter
        value={leftValue}
        onUserInput={onLeftRangeInput}
        width="48%"
        decrement={isSorted ? getDecrementLower : getIncrementUpper}
        increment={isSorted ? getIncrementLower : getDecrementUpper}
        decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
        incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
        feeAmount={feeAmount}
        label={leftPrice ? `${currencyB?.symbol}` : '-'}
        title={t('Min Price')}
        tokenA={currencyA}
        tokenB={currencyB}
      />
      <StepCounter
        value={rightValue}
        onUserInput={onRightRangeInput}
        width="48%"
        decrement={isSorted ? getDecrementUpper : getIncrementLower}
        increment={isSorted ? getIncrementUpper : getDecrementLower}
        incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
        decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
        feeAmount={feeAmount}
        label={rightPrice ? `${currencyB?.symbol}` : '-'}
        tokenA={currencyA}
        tokenB={currencyB}
        title={t('Max Price')}
      />
    </FlexGap>
  )
}
