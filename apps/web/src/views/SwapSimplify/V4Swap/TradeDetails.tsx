import { SmartRouter } from '@pancakeswap/smart-router'
import { AutoColumn, Box } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'

import { styled } from 'styled-components'

import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { GasTokenSelector } from 'components/Paymaster/GasTokenSelector'
import { usePaymaster } from 'hooks/usePaymaster'
import { isClassicOrder, isXOrder } from 'views/Swap/utils'
import { useIsWrapping, useSlippageAdjustedAmounts } from '../../Swap/V3Swap/hooks'
import { computeTradePriceBreakdown } from '../../Swap/V3Swap/utils/exchange'
import { TradeSummary } from './AdvancedSwapDetails'
import { RoutesBreakdown, XRoutesBreakdown } from './RoutesBreakdown'

export const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  border-radius: 20px;
  background-color: transparent;
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

  if (isWrapping || !order || !slippageAdjustedAmounts || !order.trade) {
    return null
  }

  const { inputAmount, outputAmount, tradeType } = order.trade

  return (
    <AdvancedDetailsFooter show>
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
          loading={!loaded}
        />
        <Box mt="10px" pl="4px">
          {isXOrder(order) ? (
            <XRoutesBreakdown wrapperStyle={{ padding: 0 }} loading={!loaded} />
          ) : (
            <RoutesBreakdown routes={order?.trade?.routes} wrapperStyle={{ padding: 0 }} loading={!loaded} />
          )}
        </Box>
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
