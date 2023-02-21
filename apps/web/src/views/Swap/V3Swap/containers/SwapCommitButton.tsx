import { useTranslation } from '@pancakeswap/localization'
import { TradeType, Percent } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  // useModal,
  confirmPriceImpactWithoutFee,
  Column,
  Box,
} from '@pancakeswap/uikit'

import { useIsTransactionUnsupported } from 'hooks/Trades'
import { Trade } from '@pancakeswap/smart-router/evm'
import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
// import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
// import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import {
  BIG_INT_ZERO,
  PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
  ALLOWED_PRICE_IMPACT_HIGH,
} from 'config/constants/exchange'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCallback, useEffect, useState } from 'react'
import { Field } from 'state/swap/actions'
import { useUserSingleHopOnly, useExpertModeManager } from 'state/user/hooks'
import { warningSeverity } from 'utils/exchange'
import { useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useCurrencyBalances } from 'state/wallet/hooks'

import ProgressSteps from '../../components/ProgressSteps'
import { SwapCallbackError } from '../../components/styleds'
// import { useSwapCallArguments } from '../hooks/useSwapCallArguments'
// import { useSwapCallback } from '../hooks/useSwapCallback'
import { useSlippageAdjustedAmounts, useRouterAddress, useSwapInputError, useParsedAmounts } from '../hooks'
// import ConfirmSwapModal from './ConfirmSwapModal'

// const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  priceImpact?: Percent
  trade?: Trade<TradeType>
  approvalSubmitted: boolean
  // onUserInput: (field: Field, typedValue: string) => void
}

export function SwapCommitButton({
  priceImpact: priceImpactWithoutFee,
  trade,
  approvalSubmitted,
}: // onUserInput,
SwapCommitButtonPropsType) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [isExpertMode] = useExpertModeManager()
  const [singleHopOnly] = useUserSingleHopOnly()
  const {
    typedValue,
    independentField,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const swapIsUnsupported = useIsTransactionUnsupported(inputCurrency, outputCurrency)
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(inputCurrency, outputCurrency, typedValue)
  const showWrap = wrapType !== WrapType.NOT_APPLICABLE
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade)
  const routerAddress = useRouterAddress(trade)
  const amountToApprove = slippageAdjustedAmounts[Field.INPUT]
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(amountToApprove, routerAddress)
  const swapInputError = useSwapInputError(trade, currencyBalances)
  const parsedAmounts = useParsedAmounts(trade, currencyBalances, showWrap)
  const parsedIndepentFieldAmount = parsedAmounts[independentField]

  // const swapCalls = useSwapCallArguments(legacyTrade, allowedSlippage, recipient)

  // the callback to execute the swap
  // const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
  //   legacyTrade,
  //   allowedSlippage,
  //   recipient,
  //   swapCalls,
  // )

  // eslint-disable-next-line
  const swapCallback = async () => {
    // TODO replace with real useCallback
    return ''
  }
  const swapCallbackError = ''
  const [
    {
      tradeToConfirm,
      swapErrorMessage,
      // attemptingTxn,
      // txHash
    },
    setSwapState,
  ] = useState<{
    tradeToConfirm: Trade<TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  // Handlers
  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(
        priceImpactWithoutFee,
        PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
        ALLOWED_PRICE_IMPACT_HIGH,
        t,
      )
    ) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t, setSwapState])

  // const handleAcceptChanges = useCallback(() => {
  //   setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  // }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])

  // const handleConfirmDismiss = useCallback(() => {
  //   setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
  //   // if there was a tx hash, we want to clear the input
  //   if (txHash) {
  //     onUserInput(Field.INPUT, '')
  //   }
  // }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])

  // End Handlers

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  // const [onPresentSettingsModal] = useModal(
  //   <SettingsModalWithCustomDismiss
  //     customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
  //     mode={SettingsMode.SWAP_LIQUIDITY}
  //   />,
  // )

  // const [onPresentConfirmModal] = useModal(
  //   <ConfirmSwapModal
  //     trade={trade}
  //     originalTrade={tradeToConfirm}
  //     currencyBalances={currencyBalances}
  //     onAcceptChanges={handleAcceptChanges}
  //     attemptingTxn={attemptingTxn}
  //     txHash={txHash}
  //     recipient={recipient}
  //     allowedSlippage={allowedSlippage}
  //     onConfirm={handleSwap}
  //     swapErrorMessage={swapErrorMessage}
  //     customOnDismiss={handleConfirmDismiss}
  //     openSettingModal={onPresentSettingsModal}
  //   />,
  //   true,
  //   true,
  //   'confirmSwapModal',
  // )
  // End Modals

  const onSwapHandler = useCallback(() => {
    if (isExpertMode) {
      handleSwap()
    } else {
      setSwapState({
        tradeToConfirm: trade,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
      })
      // onPresentConfirmModal()
    }
  }, [
    isExpertMode,
    handleSwap,
    // onPresentConfirmModal,
    trade,
  ])

  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
      // onPresentConfirmModal()
    }
  }, [
    indirectlyOpenConfirmModalState,
    // onPresentConfirmModal,
    setSwapState,
  ])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  if (swapIsUnsupported) {
    return (
      <Button width="100%" disabled>
        {t('Unsupported Asset')}
      </Button>
    )
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (showWrap) {
    return (
      <CommitButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
        {wrapInputError ?? (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
      </CommitButton>
    )
  }

  const noRoute = !(trade?.routes.length > 0)

  const userHasSpecifiedInputOutput = Boolean(
    inputCurrency && outputCurrency && parsedIndepentFieldAmount?.greaterThan(BIG_INT_ZERO),
  )

  if (noRoute && userHasSpecifiedInputOutput) {
    return (
      <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
        <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
        {singleHopOnly && <Text color="textSubtle">{t('Try enabling multi-hop trades.')}</Text>}
      </GreyCard>
    )
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const isValid = !swapInputError
  const approved = approval === ApprovalState.APPROVED
  const content = showApproveFlow ? (
    <>
      <RowBetween>
        <CommitButton
          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
          onClick={approveCallback}
          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
          width="48%"
        >
          {approval === ApprovalState.PENDING ? (
            <AutoRow gap="6px" justify="center">
              {t('Enabling')} <CircleLoader stroke="white" />
            </AutoRow>
          ) : approvalSubmitted && approved ? (
            t('Enabled')
          ) : (
            t('Enable %asset%', { asset: inputCurrency?.symbol ?? '' })
          )}
        </CommitButton>
        <CommitButton
          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
          onClick={() => {
            onSwapHandler()
          }}
          width="48%"
          id="swap-button"
          disabled={!isValid || !approved || (priceImpactSeverity > 3 && !isExpertMode)}
        >
          {priceImpactSeverity > 3 && !isExpertMode
            ? t('Price Impact High')
            : priceImpactSeverity > 2
            ? t('Swap Anyway')
            : t('Swap')}
        </CommitButton>
      </RowBetween>
      <Column style={{ marginTop: '1rem' }}>
        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
      </Column>
      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  ) : (
    <>
      <CommitButton
        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
        onClick={() => {
          onSwapHandler()
        }}
        id="swap-button"
        width="100%"
        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || !approved}
      >
        {swapInputError ||
          (priceImpactSeverity > 3 && !isExpertMode
            ? t('Price Impact Too High')
            : priceImpactSeverity > 2
            ? t('Swap Anyway')
            : t('Swap'))}
      </CommitButton>

      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  )

  return <Box mt="0.25rem">{content}</Box>
}
