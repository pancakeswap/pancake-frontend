import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { Box } from '@pancakeswap/uikit'
import throttle from 'lodash/throttle'
import { useMemo } from 'react'

import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'

import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'
import { useDerivedBestTradeWithMM } from '../MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import {
  BuyCryptoLink,
  FormHeader,
  FormMain,
  MMTradeDetail,
  PricingAndSlippage,
  SwapCommitButton,
  TradeDetails,
} from './containers'
import { MMCommitButton } from './containers/MMCommitButton'
import { MMCommitButtonV1 } from './containers/MMCommitButtonV1'
import { SwapCommitButtonV1 } from './containers/SwapCommitButtonV1'
import { useSwapBestTrade } from './hooks'
import { useCheckInsufficientError } from './hooks/useCheckSufficient'

export function V3SwapForm() {
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const mm = useDerivedBestTradeWithMM(trade)
  const throttledHandleRefresh = useMemo(
    () =>
      throttle(() => {
        refresh()
      }, 3000),
    [refresh],
  )

  const finalTrade = mm.isMMBetter ? mm?.mmTradeInfo?.trade : trade

  // console.debug('debug trade', {
  //   trade,
  //   mm,
  //   finalTrade,
  // })

  const tradeLoaded = !isLoading
  const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])

  const insufficientFundCurrency = useCheckInsufficientError(trade)

  const featureEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.UniversalRouter)
  const commitButton = useMemo(() => {
    if (featureEnabled) {
      return mm?.isMMBetter ? (
        <MMCommitButton {...mm} />
      ) : (
        <SwapCommitButton trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
      )
    }
    return mm?.isMMBetter ? (
      <MMCommitButtonV1 {...mm} />
    ) : (
      <SwapCommitButtonV1 trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
    )
  }, [error, featureEnabled, mm, trade, tradeLoaded])

  return (
    <>
      <FormHeader onRefresh={throttledHandleRefresh} refreshDisabled={!tradeLoaded || syncing || !isStale} />
      <FormMain
        tradeLoading={mm.isMMBetter ? false : !tradeLoaded}
        pricingAndSlippage={
          <PricingAndSlippage priceLoading={isLoading} price={price ?? undefined} showSlippage={!mm.isMMBetter} />
        }
        inputAmount={finalTrade?.inputAmount}
        outputAmount={finalTrade?.outputAmount}
        swapCommitButton={commitButton}
      />

      <BuyCryptoLink currency={insufficientFundCurrency} />

      {mm.isMMBetter ? (
        <MMTradeDetail loaded={!mm.mmOrderBookTrade.isLoading} mmTrade={mm.mmTradeInfo} />
      ) : (
        <TradeDetails loaded={tradeLoaded} trade={trade} />
      )}
      {(shouldShowMMLiquidityError(mm?.mmOrderBookTrade?.inputError) || mm?.mmRFQTrade?.error) && !trade && (
        <Box mt="5px">
          <MMLiquidityWarning />
        </Box>
      )}
    </>
  )
}
