import { useTranslation } from '@pancakeswap/localization'
import { Text, useModal } from '@pancakeswap/uikit'
import { Currency, CurrencyAmount, Trade, TradeType } from '@pancakeswap/sdk'

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
import useAkkaSwapCallArgs from '../hooks/useAkkaSwapCallArgs'
import { AkkaRouterRouteType } from '../hooks/types'
import { useAkkaBitgertAggrigatorSwapCallback } from '../hooks/useAkkaSwapCallback'

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
  trade: AkkaRouterRouteType
  swapInputError: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  allowedSlippage: number
  onUserInput: (field: Field, typedValue: string) => void
}

export default function AkkaSwapCommitButton({
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
  const { multiPathSwap } = useAkkaBitgertAggrigatorSwapCallback()
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: AkkaRouterRouteType | undefined
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
    if (!multiPathSwap) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    multiPathSwap(trade?.amountIn, trade?.amountOutMin, trade?.data, trade?.bridge, trade?.dstData, trade?.to)
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash.hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [multiPathSwap, tradeToConfirm, setSwapState, trade])

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

  const onSwapHandler = useCallback(() => {
    handleSwap()
  }, [isExpertMode, handleSwap, trade])

  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
    }
  }, [indirectlyOpenConfirmModalState, setSwapState])

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
        variant={isValid ? 'primary' : 'danger'}
        onClick={() => {
          onSwapHandler()
        }}
        id="swap-button"
        width="100%"
        disabled={!isValid}
      >
        {swapInputError || t('Swap')}
      </CommitButton>

      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  )
}
