import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { Box, Flex, InjectedModalProps } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { useUserSlippage } from '@pancakeswap/utils/user'
import {
  ApproveModalContent,
  ConfirmModalState,
  PendingApproveModalState,
  SwapPendingModalContent,
} from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import ConfirmSwapModalContainer from 'views/Swap/components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from 'views/Swap/components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { useApprovalPhaseStepTitles } from '../hooks/useConfirmModalState'
import { PendingConfirmModalState } from '../types'
import { ApproveStepFlow } from './ApproveStepFlow'

type ConfirmSwapModalV2Props = InjectedModalProps & {
  customOnDismiss?: () => void
  onDismiss?: () => void
  confirmModalState: ConfirmModalState
  pendingModalSteps: PendingConfirmModalState[]
  isMM?: boolean
  isRFQReady?: boolean
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  txHash?: string
  swapErrorMessage?: string
  onAcceptChanges: () => void
  onConfirm: () => void
  openSettingModal?: () => void
}

export const ConfirmSwapModalV2: React.FC<ConfirmSwapModalV2Props> = ({
  confirmModalState,
  pendingModalSteps,
  customOnDismiss,
  swapErrorMessage,
  onDismiss,
  isMM,
  isRFQReady,
  trade,
  originalTrade,
  currencyBalances,
  openSettingModal,
  onAcceptChanges,
  onConfirm,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [allowedSlippage] = useUserSlippage()
  const { recipient } = useSwapState()
  const loadingAnimationVisible = useMemo(() => {
    return [
      ConfirmModalState.RESETTING_APPROVAL,
      ConfirmModalState.APPROVING_TOKEN,
      ConfirmModalState.PERMITTING,
    ].includes(confirmModalState)
  }, [confirmModalState])

  const stepContents = useApprovalPhaseStepTitles({ trade })

  const handleDismiss = useCallback(() => {
    if (typeof customOnDismiss === 'function') {
      customOnDismiss()
    }

    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const modalContent = useMemo(() => {
    const currencyA = currencyBalances.INPUT?.currency ?? trade?.inputAmount?.currency
    const currencyB = currencyBalances.OUTPUT?.currency ?? trade?.outputAmount?.currency
    const amountA = formatAmount(trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(trade?.outputAmount, 6) ?? ''

    if (swapErrorMessage) {
      return (
        <Flex width="100%" alignItems="center" height="calc(430px - 73px - 120px)">
          <SwapTransactionErrorContent
            message={swapErrorMessage}
            onDismiss={handleDismiss}
            openSettingModal={openSettingModal}
          />
        </Flex>
      )
    }
    if (confirmModalState === ConfirmModalState.APPROVING_TOKEN) {
      return (
        <ApproveModalContent
          title={stepContents}
          isMM={isMM}
          isBonus={Boolean('TODO')}
          currencyA={currencyA as Currency}
          asBadge
          currentStep={confirmModalState}
          approvalModalSteps={pendingModalSteps as PendingApproveModalState[]}
        />
      )
    }

    if (
      confirmModalState === ConfirmModalState.PERMITTING ||
      confirmModalState === ConfirmModalState.RESETTING_APPROVAL ||
      confirmModalState === ConfirmModalState.PENDING_CONFIRMATION
    ) {
      return (
        <SwapPendingModalContent
          title={t('Confirm Swap')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
          currentStep={confirmModalState}
        >
          TODO
        </SwapPendingModalContent>
      )
    }

    return (
      <TransactionConfirmSwapContent
        isMM={isMM}
        isRFQReady={isRFQReady}
        trade={trade}
        recipient={recipient}
        originalTrade={originalTrade}
        allowedSlippage={allowedSlippage}
        currencyBalances={currencyBalances}
        onConfirm={onConfirm}
        onAcceptChanges={onAcceptChanges}
      />
    )
  }, [
    allowedSlippage,
    confirmModalState,
    currencyBalances,
    handleDismiss,
    isMM,
    isRFQReady,
    onAcceptChanges,
    onConfirm,
    openSettingModal,
    originalTrade,
    pendingModalSteps,
    recipient,
    stepContents,
    swapErrorMessage,
    t,
    trade,
  ])

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      headerPadding={loadingAnimationVisible ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={loadingAnimationVisible ? '0 24px 24px 24px' : '24px'}
      bodyTop={loadingAnimationVisible ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      confirmModalState: {ConfirmModalState[confirmModalState]}
      <Box>{modalContent}</Box>
      {loadingAnimationVisible ? (
        <ApproveStepFlow confirmModalState={confirmModalState} pendingModalSteps={pendingModalSteps} />
      ) : null}
    </ConfirmSwapModalContainer>
  )
}
