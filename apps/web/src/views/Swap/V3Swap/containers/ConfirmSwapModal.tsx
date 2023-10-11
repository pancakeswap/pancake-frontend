import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { Box, BscScanIcon, Flex, InjectedModalProps, Link } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import {
  ApproveModalContent,
  SwapPendingModalContent,
  SwapTransactionReceiptModalContent,
} from '@pancakeswap/widgets-internal'
import { memo, useCallback, useMemo } from 'react'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'

import { useDebounce } from '@pancakeswap/hooks'
import { useUserSlippage } from '@pancakeswap/utils/user'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Allowance } from 'hooks/usePermit2Allowance'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { ConfirmModalState, PendingConfirmModalState } from '../types'

import ConfirmSwapModalContainer from '../../components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from '../../components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { isInApprovalPhase, useApprovalPhaseStepTitles } from '../hooks/useConfirmModalState'
import { useWallchainStatus } from '../hooks/useWallchain'
import { ApproveStepFlow } from './ApproveStepFlow'

interface ConfirmSwapModalProps {
  isMM?: boolean
  isRFQReady?: boolean
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  approval?: ApprovalState
  allowance?: Allowance
  isPendingError: boolean
  swapErrorMessage?: string
  showApproveFlow: boolean
  currentAllowance?: CurrencyAmount<Currency>
  confirmModalState: ConfirmModalState
  startSwapFlow: () => void
  pendingModalSteps: PendingConfirmModalState[]
  onAcceptChanges: () => void
  customOnDismiss?: () => void
  openSettingModal?: () => void
}

export const ConfirmSwapModal = memo<InjectedModalProps & ConfirmSwapModalProps>(function ConfirmSwapModalComp({
  isMM,
  trade,
  txHash,
  isRFQReady,
  attemptingTxn,
  originalTrade,
  showApproveFlow,
  currencyBalances,
  swapErrorMessage,
  confirmModalState,
  isPendingError,
  startSwapFlow,
  pendingModalSteps,
  onDismiss,
  onAcceptChanges,
  customOnDismiss,
  openSettingModal,
}) {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippage()
  const { recipient } = useSwapState()
  const [wallchainStatus] = useWallchainStatus()
  const isBonus = useDebounce(wallchainStatus === 'found', 500)

  const token: Token | undefined = wrappedCurrency(trade?.outputAmount?.currency, chainId)

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss?.()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const stepContents = useApprovalPhaseStepTitles({ trade })
  const isApproving = isInApprovalPhase(confirmModalState)

  const topModal = useMemo(() => {
    const currencyA = currencyBalances.INPUT?.currency ?? trade?.inputAmount?.currency
    const currencyB = currencyBalances.OUTPUT?.currency ?? trade?.outputAmount?.currency
    const amountA = formatAmount(trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(trade?.outputAmount, 6) ?? ''

    if (showApproveFlow && isApproving && !isPendingError) {
      return (
        <ApproveModalContent
          title={stepContents}
          isMM={isMM}
          isBonus={isBonus}
          currencyA={currencyA as Currency}
          asBadge={confirmModalState === ConfirmModalState.APPROVING_TOKEN}
          currentStep={confirmModalState}
          approvalModalSteps={pendingModalSteps as any}
        />
      )
    }

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

    if (attemptingTxn || confirmModalState === ConfirmModalState.PENDING_CONFIRMATION || isApproving) {
      const isSubmitted = !attemptingTxn && !isApproving
      return (
        <SwapPendingModalContent
          title={attemptingTxn ? t('Confirm Swap') : t('Transaction Submitted')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
          currentStep={confirmModalState}
          showIcon={isSubmitted}
        >
          {isSubmitted ? (
            <AddToWalletButton
              mt="39px"
              height="auto"
              variant="tertiary"
              width="fit-content"
              padding="6.5px 20px"
              marginTextBetweenLogo="6px"
              textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
              tokenAddress={token?.address}
              tokenSymbol={currencyB?.symbol}
              tokenDecimals={token?.decimals}
              tokenLogo={token instanceof WrappedTokenInfo ? (token as WrappedTokenInfo)?.logoURI : undefined}
            />
          ) : null}
        </SwapPendingModalContent>
      )
    }

    if (confirmModalState === ConfirmModalState.REVIEWING && txHash) {
      return (
        <SwapTransactionReceiptModalContent
          explorerLink={
            chainId ? (
              <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
                {t('View on %site%', { site: getBlockExploreName(chainId) })}: {truncateHash(txHash, 8, 0)}
                {chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
              </Link>
            ) : (
              <></>
            )
          }
        >
          <AddToWalletButton
            mt="39px"
            height="auto"
            variant="tertiary"
            width="fit-content"
            padding="6.5px 20px"
            marginTextBetweenLogo="6px"
            textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
            tokenAddress={token?.address}
            tokenSymbol={currencyB?.symbol}
            tokenDecimals={token?.decimals}
            tokenLogo={token instanceof WrappedTokenInfo ? (token as WrappedTokenInfo)?.logoURI : undefined}
          />
        </SwapTransactionReceiptModalContent>
      )
    }

    return (
      <TransactionConfirmSwapContent
        isMM={isMM}
        trade={trade}
        recipient={recipient}
        isRFQReady={isRFQReady}
        originalTrade={originalTrade}
        allowedSlippage={allowedSlippage}
        currencyBalances={currencyBalances}
        onConfirm={startSwapFlow}
        onAcceptChanges={onAcceptChanges}
      />
    )
  }, [
    isMM,
    trade,
    txHash,
    isRFQReady,
    originalTrade,
    attemptingTxn,
    currencyBalances,
    showApproveFlow,
    swapErrorMessage,
    token,
    chainId,
    recipient,
    allowedSlippage,
    confirmModalState,
    t,
    handleDismiss,
    startSwapFlow,
    onAcceptChanges,
    openSettingModal,
    isBonus,
    isApproving,
    isPendingError,
    pendingModalSteps,
    stepContents,
  ])

  const isShowingLoadingAnimation = useMemo(
    () =>
      confirmModalState === ConfirmModalState.RESETTING_APPROVAL ||
      confirmModalState === ConfirmModalState.PERMITTING ||
      confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
      attemptingTxn,
    [confirmModalState, attemptingTxn],
  )

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalState.REVIEWING}
      headerPadding={isShowingLoadingAnimation ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={isShowingLoadingAnimation ? '0 24px 24px 24px' : '24px'}
      bodyTop={isShowingLoadingAnimation ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>{topModal}</Box>
      {isShowingLoadingAnimation && !swapErrorMessage && (
        <ApproveStepFlow confirmModalState={confirmModalState} pendingModalSteps={pendingModalSteps} />
      )}
    </ConfirmSwapModalContainer>
  )
})
