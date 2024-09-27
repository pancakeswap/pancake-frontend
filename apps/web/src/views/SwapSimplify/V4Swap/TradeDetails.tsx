import { SmartRouter } from '@pancakeswap/smart-router'
import { AutoColumn } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'

import { styled } from 'styled-components'

import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { GasTokenSelector } from 'components/Paymaster/GasTokenSelector'
import { usePaymaster } from 'hooks/usePaymaster'
import { isClassicOrder, isXOrder } from 'views/Swap/utils'
import { RoutesBreakdown, XRoutesBreakdown } from '../../Swap/V3Swap/components'
import { useIsWrapping, useSlippageAdjustedAmounts } from '../../Swap/V3Swap/hooks'
import { computeTradePriceBreakdown } from '../../Swap/V3Swap/utils/exchange'
import { TradeSummary } from './AdvancedSwapDetails'

export const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

interface Props {
  loaded: boolean
  order?: PriceOrder
}

export const TradeDetails = memo(function TradeDetails({ loaded, order }: Props) {
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(order)
  const isWrapping = useIsWrapping()
  const { priceImpactWithoutFee, lpFeeAmount } = useMemo(
    () => computeTradePriceBreakdown(isXOrder(order) ? order.ammTrade : order?.trade),
    [order],
  )
  const hasStablePool = useMemo(
    () =>
      isClassicOrder(order)
        ? order.trade?.routes.some((route) => route.pools.some(SmartRouter.isStablePool))
        : undefined,
    [order],
  )

  const { isPaymasterAvailable } = usePaymaster()

  if (isWrapping || !loaded || !order || !slippageAdjustedAmounts || !order.trade) {
    return null
  }

  const { inputAmount, outputAmount, tradeType } = order.trade

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        <TradeSummary
          isX={isXOrder(order)}
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          tradeType={tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee ?? undefined}
          realizedLPFee={lpFeeAmount ?? undefined}
          hasStablePair={hasStablePool}
          gasTokenSelector={isPaymasterAvailable && <GasTokenSelector currency={order?.trade.inputAmount.currency} />}
        />
        {isXOrder(order) ? <XRoutesBreakdown /> : <RoutesBreakdown routes={order?.trade?.routes} />}
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
