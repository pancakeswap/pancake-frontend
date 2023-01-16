import { useTranslation } from '@pancakeswap/localization'
import { Text, useModal } from '@pancakeswap/uikit'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { GreyCard } from 'components/Card'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { ApprovalState } from 'hooks/useApproveCallback'
import CircleLoader from 'components/Loader/CircleLoader'
import { Field } from 'state/swap/actions'
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { useCallback, useEffect, useState } from 'react'
import Column from 'components/Layout/Column'
import { useSwapCallback } from 'hooks/useSwapCallback'

import ConfirmSwapModal from '../../components/ConfirmSwapModal'
import ProgressSteps from '../../components/ProgressSteps'
import { SwapCallbackError } from '../../components/styleds'
import useStableSwapCallArgs from '../hooks/useStableSwapCallArgs'
import { StableTrade } from '../hooks/useStableTradeExactIn'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface StableSwapCommitButtonPropsType {
  account: string
  approval: ApprovalState
  approveCallback: () => Promise<void>
  approvalSubmitted: boolean
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  isExpertMode: boolean
  trade: StableTrade
  swapInputError: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  allowedSlippage: number
  onUserInput: (field: Field, typedValue: string) => void
}

export default function StableSwapCommitButton({
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  currencies,
  isExpertMode,
  trade,
  swapInputError,
  currencyBalances,
  allowedSlippage,
  onUserInput,
}: StableSwapCommitButtonPropsType) {
  const { t } = useTranslation()
  // the callback to execute the swap
  const swapCalls = useStableSwapCallArgs(trade)

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, null, swapCalls)
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: StableTrade | undefined
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
  }, [swapCallback, tradeToConfirm, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])

  // End Handlers

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      isStable
      trade={trade}
      originalTrade={tradeToConfirm}
      currencyBalances={currencyBalances}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={null}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'confirmSwapModal',
  )
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
      onPresentConfirmModal()
    }
  }, [isExpertMode, handleSwap, onPresentConfirmModal, trade])

  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
      onPresentConfirmModal()
    }
  }, [indirectlyOpenConfirmModalState, onPresentConfirmModal, setSwapState])

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  const isSufficentLiquidity = false

  if (isSufficentLiquidity) {
    return (
      <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
        <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
      </GreyCard>
    )
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))
  const isValid = !swapInputError

  if (showApproveFlow) {
    return (
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
            ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
            )}
          </CommitButton>
          <CommitButton
            variant={isValid ? 'danger' : 'primary'}
            onClick={() => {
              onSwapHandler()
            }}
            width="48%"
            id="swap-button"
            disabled={!isValid || approval !== ApprovalState.APPROVED}
          >
            {t('Swap')}
          </CommitButton>
        </RowBetween>
        <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column>
        {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant={isValid || !swapCallbackError ? 'primary' : 'danger'}
        onClick={() => {
          onSwapHandler()
        }}
        id="swap-button"
        width="100%"
        disabled={!isValid || !!swapCallbackError}
      >
        {swapInputError || t('Swap')}
      </CommitButton>

      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  )
}
