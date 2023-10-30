import { Currency } from '@pancakeswap/sdk'
import { useExpertMode } from '@pancakeswap/utils/user'
import { useCurrency } from 'hooks/Tokens'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useEffect, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { isChainSupported } from 'utils/wagmi'
import { getUniversalRouterAddress } from '@pancakeswap/universal-router-sdk'
import { MMSwapCommitButton } from 'views/Swap/MMLinkPools/components/MMCommitButton'
import { useAccount, useChainId } from 'wagmi'
import usePermit2Allowance from 'hooks/usePermit2Allowance'

export function MMCommitButton({ mmOrderBookTrade, mmRFQTrade, mmQuoteExpiryRemainingSec, mmTradeInfo }) {
  const {
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const chainId = useChainId()

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

  const { approvalState, currentAllowance, isPendingError } = useApproveCallback(
    mmTradeInfo?.slippageAdjustedAmounts[Field.INPUT],
    mmTradeInfo?.routerAddress,
  )

  const allowance = usePermit2Allowance(
    mmTradeInfo?.routerAddress,
    mmTradeInfo?.slippageAdjustedAmounts[Field.INPUT],
    isChainSupported(chainId) ? getUniversalRouterAddress(chainId) : undefined,
  )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // Reset approval flow if input currency changed
  useEffect(() => {
    setApprovalSubmitted(false)
  }, [inputCurrencyId])

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const { onUserInput } = useSwapActionHandlers()

  return (
    <MMSwapCommitButton
      showWrap={showWrap}
      approval={approvalState}
      swapIsUnsupported={swapIsUnsupported}
      account={account}
      approvalSubmitted={approvalSubmitted}
      onWrap={onWrap}
      allowance={allowance}
      currencies={currencies}
      currencyBalances={mmOrderBookTrade?.currencyBalances}
      isExpertMode={isExpertMode}
      mmQuoteExpiryRemainingSec={mmQuoteExpiryRemainingSec}
      rfqTrade={mmRFQTrade}
      swapInputError={mmOrderBookTrade?.swapInputError}
      wrapType={wrapType}
      wrapInputError={wrapInputError}
      recipient={recipient}
      onUserInput={onUserInput}
      isPendingError={isPendingError}
      currentAllowance={currentAllowance}
    />
  )
}
