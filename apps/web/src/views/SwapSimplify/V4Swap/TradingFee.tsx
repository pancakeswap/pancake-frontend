import { useTranslation } from '@pancakeswap/localization'
import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { FlexGap, SkeletonV2, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { memo, useMemo } from 'react'
import { isXOrder } from 'views/Swap/utils'
import { useIsWrapping, useSlippageAdjustedAmounts } from '../../Swap/V3Swap/hooks'
import { computeTradePriceBreakdown } from '../../Swap/V3Swap/utils/exchange'

interface TradingFeeProps {
  loaded: boolean
  order?: PriceOrder
}

export const TradingFee: React.FC<TradingFeeProps> = memo(({ order, loaded }) => {
  const { t } = useTranslation()
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(order)
  const { lpFeeAmount } = useMemo(
    () => computeTradePriceBreakdown(isXOrder(order) ? order.ammTrade : order?.trade),
    [order],
  )
  const isWrapping = useIsWrapping()

  if (isWrapping || !order || !order.trade || !slippageAdjustedAmounts) {
    return null
  }
  const { inputAmount } = order.trade

  return (
    <FlexGap gap="8px" alignItems="center">
      <Text color="textSubtle" fontSize="14px">
        {t('Fee')}
      </Text>
      <SkeletonV2 width="108px" height="16px" borderRadius="8px" minHeight="auto" isDataReady={loaded}>
        {isXOrder(order) ? (
          <Text color="primary" fontSize="14px">
            0 {inputAmount?.currency?.symbol}
          </Text>
        ) : (
          <Text color="textSubtle" fontSize="14px">{`${formatAmount(lpFeeAmount, 4)} ${
            inputAmount?.currency?.symbol
          }`}</Text>
        )}
      </SkeletonV2>
    </FlexGap>
  )
})
