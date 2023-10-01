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
import { useWallchainStatus } from '../hooks/useWallchain'
import { ApproveStepFlow } from './ApproveStepFlow'
import { isInApprovalPhase } from '../hooks/useConfirmModalState'

interface ConfirmSwapModalProps {
  isMM?: boolean
  isRFQReady?: boolean
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  approval: ApprovalState
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
const usePendingSwapTitle = ({ trade }: { trade: SmartRouterTrade<TradeType> }) => {
  const { t } = useTranslation()
  return useMemo(() => {
    return {
      [ConfirmModalState.PENDING_CONFIRMATION]: t('Confirm Swap'),
      [ConfirmModalState.RESETTING_APPROVAL]: t('Reset approval on USDT.'),
      [ConfirmModalState.APPROVING_TOKEN]: t('Approve %symbol%', { symbol: trade?.inputAmount?.currency?.symbol }),
      [ConfirmModalState.PERMITTING]: t('Permit %symbol%', { symbol: trade?.inputAmount?.currency?.symbol }),
    }
  }, [trade?.inputAmount?.currency?.symbol, t])
}

export const ConfirmSwapModal = memo<InjectedModalProps & ConfirmSwapModalProps>(function ConfirmSwapModalComp({
  isMM,
  trade,
  txHash,
  isRFQReady,
  attemptingTxn,
  originalTrade,
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

  const stepContents = usePendingSwapTitle({
    trade,
  })

  const topModal = useCallback(() => {
    const currencyA = currencyBalances.INPUT?.currency ?? trade?.inputAmount?.currency
    const currencyB = currencyBalances.OUTPUT?.currency ?? trade?.outputAmount?.currency
    const amountA = formatAmount(trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(trade?.outputAmount, 6) ?? ''

    if (
      !isPendingError &&
      (confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
        confirmModalState === ConfirmModalState.PERMITTING ||
        confirmModalState === ConfirmModalState.RESETTING_APPROVAL ||
        (attemptingTxn && confirmModalState === ConfirmModalState.PENDING_CONFIRMATION))
    ) {
      return (
        <ApproveModalContent
          title={stepContents}
          isMM={isMM}
          isBonus={isBonus}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
          confirmModalState={confirmModalState}
          pendingModalSteps={pendingModalSteps}
          attemptingTransaction={attemptingTxn}
          txHash={txHash}
          addToWalletButtonContent={<></>}
        />
      )
    }

    if (!attemptingTxn && confirmModalState === ConfirmModalState.PENDING_CONFIRMATION) {
      return (
        <SwapPendingModalContent
          showIcon
          title={t('Transaction Submitted')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
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
        </SwapPendingModalContent>
      )
    }

    if (confirmModalState === ConfirmModalState.REVIEWING && txHash) {
      return (
        <SwapTransactionReceiptModalContent
          getBlockExploreLink={getBlockExploreLink}
          getBlockExploreName={getBlockExploreName}
          truncateHash={truncateHash}
          txHash={txHash}
          chainId={chainId}
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
    token,
    chainId,
    recipient,
    allowedSlippage,
    confirmModalState,
    t,
    startSwapFlow,
    onAcceptChanges,
    isBonus,
    pendingModalSteps,
    stepContents,
    isPendingError,
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
      <Box>
        {swapErrorMessage ? (
          <Flex width="100%" alignItems="center" height="calc(430px - 73px - 120px)">
            <SwapTransactionErrorContent
              message={swapErrorMessage}
              onDismiss={handleDismiss}
              openSettingModal={openSettingModal}
            />
          </Flex>
        ) : (
          topModal()
        )}
      </Box>
      {isShowingLoadingAnimation && !swapErrorMessage && (
        <ApproveStepFlow confirmModalState={confirmModalState} pendingModalSteps={pendingModalSteps} />
      )}
    </ConfirmSwapModalContainer>
  )
})
