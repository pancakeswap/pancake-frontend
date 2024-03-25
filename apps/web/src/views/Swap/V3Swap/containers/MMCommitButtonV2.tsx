import { Currency, TradeType } from '@pancakeswap/sdk'
import { useExpertMode } from '@pancakeswap/utils/user'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { useCurrency } from 'hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { memo, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { MMSwapCommitButtonV2 } from 'views/Swap/MMLinkPools/components/MMCommitButtonV2'
import { useAccount } from 'wagmi'
import { CommitButtonProps, MMCommitTrade } from '../types'

const MMCommitButtonCompV2: React.FC<MMCommitTrade<SmartRouterTrade<TradeType>> & CommitButtonProps> = ({
  mmOrderBookTrade,
  mmRFQTrade,
  mmQuoteExpiryRemainingSec,
  mmTradeInfo,
  beforeCommit,
  afterCommit,
}) => {
  const {
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId) ?? undefined
  const outputCurrency = useCurrency(outputCurrencyId) ?? undefined
  const { address: account } = useAccount()
  const [isExpertMode] = useExpertMode()
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency],
  )
  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(inputCurrency, outputCurrency, typedValue)
  const showWrap = wrapType !== WrapType.NOT_APPLICABLE
  const { onUserInput } = useSwapActionHandlers()

  return (
    <MMSwapCommitButtonV2
      beforeCommit={beforeCommit}
      afterCommit={afterCommit}
      mmTradeInfo={mmTradeInfo}
      showWrap={showWrap}
      swapIsUnsupported={swapIsUnsupported}
      account={account}
      onWrap={onWrap}
      currencies={currencies}
      currencyBalances={mmOrderBookTrade?.currencyBalances}
      isExpertMode={isExpertMode}
      mmQuoteExpiryRemainingSec={mmQuoteExpiryRemainingSec}
      rfqTrade={mmRFQTrade}
      swapInputError={mmOrderBookTrade?.inputError}
      wrapType={wrapType}
      wrapInputError={wrapInputError}
      recipient={recipient}
      onUserInput={onUserInput}
      // isPendingError={isPendingError}
    />
  )
}

export const MMCommitButtonV2 = memo(MMCommitButtonCompV2)
