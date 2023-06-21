import { SmartRouter } from '@pancakeswap/smart-router/evm'
import throttle from 'lodash/throttle'
import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'
import { Box, Row, Text } from '@pancakeswap/uikit'
import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import InternalLink from 'components/Links'

import { useWeb3React } from '@pancakeswap/wagmi'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useAllOnRampTokens, useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useDerivedBestTradeWithMM } from '../MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import { useSwapBestTrade } from './hooks'

import { MMCommitButton } from './containers/MMCommitButton'
import { FormHeader, FormMain, MMTradeDetail, PricingAndSlippage, SwapCommitButton, TradeDetails } from './containers'

export function V3SwapForm() {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const native = useNativeCurrency()
  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const onRampCurrencies = useAllOnRampTokens()

  const doesSelectedTokenSupportOnRamp = Boolean(
    onRampCurrencies[inputCurrency?.symbol] || native.symbol === inputCurrencyId,
  )

  const mm = useDerivedBestTradeWithMM(trade)
  const throttledHandleRefresh = useMemo(
    () =>
      throttle(() => {
        refresh()
      }, 3000),
    [refresh],
  )

  const finalTrade = mm.isMMBetter ? mm?.mmTradeInfo?.trade : trade

  const tradeLoaded = !isLoading
  const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])

  return (
    <>
      <FormHeader onRefresh={throttledHandleRefresh} refreshDisabled={!tradeLoaded || syncing || !isStale} />
      <FormMain
        tradeLoading={mm.isMMBetter ? false : !tradeLoaded}
        pricingAndSlippage={<PricingAndSlippage priceLoading={isLoading} price={price} showSlippage={!mm.isMMBetter} />}
        inputAmount={finalTrade?.inputAmount}
        outputAmount={finalTrade?.outputAmount}
        swapCommitButton={
          mm?.isMMBetter ? (
            <MMCommitButton {...mm} />
          ) : (
            <SwapCommitButton trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
          )
        }
        inputBalance={inputBalance}
        inputCurrencyId={inputCurrencyId}
        outputCurrencyId={outputCurrencyId}
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        typedValue={typedValue}
        independentField={independentField}
      />
      {doesSelectedTokenSupportOnRamp && typedValue !== '' && Number(inputBalance.toFixed(7)) < Number(typedValue) ? (
        <Row alignItems="center" justifyContent="center" mb="4px">
          <Text fontSize="14px">
            Insufficent Funds?{' '}
            <InternalLink href={`/buy-crypto?inputCurrency=${inputCurrency.symbol}`}>
              {t('Buy Crypto here.')}
            </InternalLink>
          </Text>
        </Row>
      ) : null}

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
