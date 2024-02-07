import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'
import { memo, useCallback, useMemo } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { Box, BscScanIcon, Flex, InjectedModalProps, Link } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import {
  ApproveModalContentV1,
  SwapPendingModalContentV1,
  SwapTransactionReceiptModalContentV1,
} from '@pancakeswap/widgets-internal'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'

import { useDebounce } from '@pancakeswap/hooks'
import { useUserSlippage } from '@pancakeswap/utils/user'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { ConfirmModalStateV1, PendingConfirmModalStateV1 } from '../types'

import ConfirmSwapModalContainer from '../../components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from '../../components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { useWallchainStatus } from '../hooks/useWallchain'
import { ApproveStepFlowV1 } from './ApproveStepFlowV1'

interface ConfirmSwapModalProps {
  isMM?: boolean
  isRFQReady?: boolean
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  approval: ApprovalState
  swapErrorMessage?: string | boolean
  showApproveFlow: boolean
  confirmModalState: ConfirmModalStateV1
  startSwapFlow: () => void
  pendingModalSteps: PendingConfirmModalStateV1[]
  currentAllowance?: CurrencyAmount<Currency>
  onAcceptChanges: () => void
  customOnDismiss?: () => void
  openSettingModal?: () => void
}

export const ConfirmSwapModalV1 = memo<InjectedModalProps & ConfirmSwapModalProps>(function ConfirmSwapModalComp({
  isMM,
  trade,
  txHash,
  confirmModalState,
  startSwapFlow,
  pendingModalSteps,
  isRFQReady,
  attemptingTxn,
  originalTrade,
  showApproveFlow,
  currencyBalances,
  swapErrorMessage,
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

  const topModal = useMemo(() => {
    const currencyA = currencyBalances.INPUT?.currency ?? trade?.inputAmount?.currency
    const currencyB = currencyBalances.OUTPUT?.currency ?? trade?.outputAmount?.currency
    const amountA = formatAmount(trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(trade?.outputAmount, 6) ?? ''

    if (confirmModalState === ConfirmModalStateV1.RESETTING_APPROVAL) {
      return <ApproveModalContentV1 title={t('Reset Approval on USDT')} isMM={isMM} isBonus={isBonus} />
    }

    if (
      showApproveFlow &&
      (confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN ||
        confirmModalState === ConfirmModalStateV1.APPROVE_PENDING)
    ) {
      return (
        <ApproveModalContentV1
          title={t('Enable spending %symbol%', { symbol: `${trade?.inputAmount?.currency?.symbol}` })}
          isMM={isMM}
          isBonus={isBonus}
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

    if (attemptingTxn) {
      return (
        <SwapPendingModalContentV1
          title={t('Confirm Swap')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
        />
      )
    }

    if (confirmModalState === ConfirmModalStateV1.PENDING_CONFIRMATION) {
      return (
        <SwapPendingModalContentV1
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
            tokenLogo={token instanceof WrappedTokenInfo ? token?.logoURI : undefined}
          />
        </SwapPendingModalContentV1>
      )
    }

    if (confirmModalState === ConfirmModalStateV1.COMPLETED && txHash) {
      return (
        <SwapTransactionReceiptModalContentV1>
          {chainId && (
            <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
              {t('View on %site%', { site: getBlockExploreName(chainId) })}: {truncateHash(txHash, 8, 0)}
              {chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
            </Link>
          )}
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
            tokenLogo={token instanceof WrappedTokenInfo ? token?.logoURI : undefined}
          />
        </SwapTransactionReceiptModalContentV1>
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
    isBonus,
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
  ])

  const isShowingLoadingAnimation = useMemo(
    () =>
      confirmModalState === ConfirmModalStateV1.RESETTING_APPROVAL ||
      confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN ||
      confirmModalState === ConfirmModalStateV1.APPROVE_PENDING ||
      attemptingTxn,
    [confirmModalState, attemptingTxn],
  )

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalStateV1.REVIEWING}
      headerPadding={isShowingLoadingAnimation ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={isShowingLoadingAnimation ? '0 24px 24px 24px' : '24px'}
      bodyTop={isShowingLoadingAnimation ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>{topModal}</Box>
      {isShowingLoadingAnimation && !swapErrorMessage && (
        <ApproveStepFlowV1 confirmModalState={confirmModalState} pendingModalSteps={pendingModalSteps} />
      )}
    </ConfirmSwapModalContainer>
  )
})
