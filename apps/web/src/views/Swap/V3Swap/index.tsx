import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { Box } from '@pancakeswap/uikit'
import throttle from 'lodash/throttle'
import { useMemo, useRef, useState } from 'react'

import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'

import { TradeType } from '@pancakeswap/swap-sdk-core'
import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'
import { useDerivedBestTradeWithMM } from '../MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import {
  BuyCryptoLink,
  FormHeader,
  FormMain,
  MMTradeDetail,
  PricingAndSlippage,
  SwapCommitButtonV2,
  TradeDetails,
} from './containers'
import { MMCommitButton } from './containers/MMCommitButton'
import { MMCommitButtonV2 } from './containers/MMCommitButtonV2'
import { SwapCommitButton } from './containers/SwapCommitButton'
import { useSwapBestTrade } from './hooks'
import { useCheckInsufficientError } from './hooks/useCheckSufficient'

export function V3SwapForm() {
  const [lock, setLock] = useState(false)
  const lockedAMMTrade = useRef<SmartRouterTrade<TradeType> | undefined>()
  const lockedMMTrade = useRef<ReturnType<typeof useDerivedBestTradeWithMM>>()
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const mm = useDerivedBestTradeWithMM(trade)

  const ammCurrentTrade = useMemo(() => {
    if (!lockedAMMTrade.current) {
      lockedAMMTrade.current = trade
    }
    lockedAMMTrade.current = lock ? lockedAMMTrade.current : trade
    return lockedAMMTrade.current
  }, [lock, trade])
  const mmCurrentTrade = useMemo(() => {
    if (!lockedMMTrade.current) {
      lockedMMTrade.current = mm
    }
    lockedMMTrade.current = lock ? lockedMMTrade.current : mm
    return lockedMMTrade.current
  }, [lock, mm])

  const throttledHandleRefresh = useMemo(
    () =>
      throttle(() => {
        refresh()
      }, 3000),
    [refresh],
  )

  const finalTrade = mmCurrentTrade.isMMBetter ? mmCurrentTrade?.mmTradeInfo?.trade : ammCurrentTrade

  const tradeLoaded = !isLoading
  const price = useMemo(() => ammCurrentTrade && SmartRouter.getExecutionPrice(ammCurrentTrade), [ammCurrentTrade])

  const insufficientFundCurrency = useCheckInsufficientError(ammCurrentTrade)

  const featureEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.UniversalRouter)
  const commitButton = useMemo(() => {
    if (featureEnabled) {
      return mmCurrentTrade?.isMMBetter ? (
        <MMCommitButtonV2 {...mmCurrentTrade} setLock={setLock} />
      ) : (
        <SwapCommitButtonV2 trade={ammCurrentTrade} tradeError={error} tradeLoading={!tradeLoaded} setLock={setLock} />
      )
    }
    return mmCurrentTrade?.isMMBetter ? (
      <MMCommitButton {...mmCurrentTrade} />
    ) : (
      <SwapCommitButton trade={ammCurrentTrade} tradeError={error} tradeLoading={!tradeLoaded} />
    )
  }, [mmCurrentTrade, featureEnabled, ammCurrentTrade, error, tradeLoaded])

  return (
    <>
      <FormHeader onRefresh={throttledHandleRefresh} refreshDisabled={!tradeLoaded || syncing || !isStale} />
      <FormMain
        tradeLoading={mmCurrentTrade.isMMBetter ? false : !tradeLoaded}
        pricingAndSlippage={
          <PricingAndSlippage
            priceLoading={isLoading}
            price={price ?? undefined}
            showSlippage={!mmCurrentTrade.isMMBetter}
          />
        }
        inputAmount={finalTrade?.inputAmount}
        outputAmount={finalTrade?.outputAmount}
        swapCommitButton={commitButton}
      />

      <BuyCryptoLink currency={insufficientFundCurrency} />

      {mmCurrentTrade.isMMBetter ? (
        <MMTradeDetail loaded={!mmCurrentTrade.mmOrderBookTrade.isLoading} mmTrade={mmCurrentTrade.mmTradeInfo} />
      ) : (
        <TradeDetails loaded={tradeLoaded} trade={ammCurrentTrade} />
      )}
      {(shouldShowMMLiquidityError(mmCurrentTrade?.mmOrderBookTrade?.inputError) ||
        mmCurrentTrade?.mmRFQTrade?.error) &&
        !ammCurrentTrade && (
          <Box mt="5px">
            <MMLiquidityWarning />
          </Box>
        )}
    </>
  )
}
