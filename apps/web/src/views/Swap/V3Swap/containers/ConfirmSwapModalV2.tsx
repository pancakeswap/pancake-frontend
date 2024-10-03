import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'
import { useCallback, useMemo } from 'react'

import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { Box, BscScanIcon, Flex, InjectedModalProps, Link } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useUserSlippage } from '@pancakeswap/utils/user'
import {
  ApproveModalContent,
  ConfirmModalState,
  SwapPendingModalContent,
  SwapTransactionReceiptModalContent,
} from '@pancakeswap/widgets-internal'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import ConfirmSwapModalContainer from 'views/Swap/components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from 'views/Swap/components/SwapTransactionErrorContent'

import { Hash } from 'viem'
import { InterfaceOrder, isXOrder } from 'views/Swap/utils'
import { TransactionConfirmSwapContentV2 } from '../components/TransactionConfirmSwapContentV2'
import { useSlippageAdjustedAmounts } from '../hooks'
import { ConfirmAction } from '../hooks/useConfirmModalState'
import { AllowedAllowanceState } from '../types'
import { ApproveStepFlow } from './ApproveStepFlow'

export const useApprovalPhaseStepTitles: ({ trade }: { trade: InterfaceOrder['trade'] | undefined }) => {
  [step in AllowedAllowanceState]: string
} = ({ trade }) => {
  const { t } = useTranslation()
  return useMemo(() => {
    return {
      [ConfirmModalState.RESETTING_APPROVAL]: t('Reset approval on USDT.'),
      [ConfirmModalState.APPROVING_TOKEN]: t('Approve %symbol%', {
        symbol: trade ? trade.inputAmount.currency.symbol : '',
      }),
      [ConfirmModalState.PERMITTING]: t('Permit %symbol%', { symbol: trade ? trade.inputAmount.currency.symbol : '' }),
    }
  }, [t, trade])
}

type ConfirmSwapModalV2Props = InjectedModalProps & {
  customOnDismiss?: () => void
  onDismiss?: () => void
  confirmModalState: ConfirmModalState
  pendingModalSteps: ConfirmAction[]
  order?: InterfaceOrder | null
  originalOrder?: InterfaceOrder | null
  currencyBalances?: { [field in Field]?: CurrencyAmount<Currency> }
  txHash?: string
  orderHash?: Hash
  swapErrorMessage?: string
  onAcceptChanges: () => void
  onConfirm: (setConfirmModalState?: () => void) => void
  openSettingModal?: () => void
}

export const ConfirmSwapModalV2: React.FC<ConfirmSwapModalV2Props> = ({
  confirmModalState,
  pendingModalSteps,
  order,
  originalOrder,
  currencyBalances,
  swapErrorMessage,
  onDismiss,
  customOnDismiss,
  txHash,
  orderHash,
  openSettingModal,
  onAcceptChanges,
  onConfirm,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [allowedSlippage] = useUserSlippage()
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(originalOrder)
  const { recipient } = useSwapState()
  const loadingAnimationVisible = useMemo(() => {
    return [
      ConfirmModalState.RESETTING_APPROVAL,
      ConfirmModalState.APPROVING_TOKEN,
      ConfirmModalState.PERMITTING,
    ].includes(confirmModalState)
  }, [confirmModalState])
  const hasError = useMemo(() => swapErrorMessage !== undefined, [swapErrorMessage])
  const stepsVisible = useMemo(() => {
    if (swapErrorMessage) return false
    if (confirmModalState === ConfirmModalState.REVIEWING || confirmModalState === ConfirmModalState.COMPLETED)
      return false
    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION && txHash) return false
    return pendingModalSteps.length > 0 && pendingModalSteps.some((step) => step.showIndicator)
  }, [confirmModalState, pendingModalSteps, swapErrorMessage, txHash])

  const stepContents = useApprovalPhaseStepTitles({ trade: originalOrder?.trade })
  const token: Token | undefined = useMemo(
    () => wrappedCurrency(originalOrder?.trade?.outputAmount?.currency, chainId),
    [chainId, originalOrder?.trade?.outputAmount?.currency],
  )

  const showAddToWalletButton = useMemo(() => {
    if (token && originalOrder?.trade?.outputAmount?.currency) {
      return !originalOrder?.trade?.outputAmount?.currency?.isNative
    }
    return false
  }, [token, originalOrder])

  const handleDismiss = useCallback(() => {
    if (typeof customOnDismiss === 'function') {
      customOnDismiss()
    }

    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const modalContent = useMemo(() => {
    const isExactIn = originalOrder?.trade.tradeType === TradeType.EXACT_INPUT
    const currencyA = currencyBalances?.INPUT?.currency ?? originalOrder?.trade?.inputAmount?.currency
    const currencyB = currencyBalances?.OUTPUT?.currency ?? originalOrder?.trade?.outputAmount?.currency
    const amountAWithSlippage = formatAmount(slippageAdjustedAmounts[Field.INPUT], 6) ?? ''
    const amountBWithSlippage = formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 6) ?? ''
    const amountA = isExactIn ? amountAWithSlippage : `Max ${amountAWithSlippage}`
    const amountB = isExactIn ? `Min ${amountBWithSlippage}` : amountBWithSlippage

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
    if (
      confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
      confirmModalState === ConfirmModalState.PERMITTING ||
      confirmModalState === ConfirmModalState.RESETTING_APPROVAL
    ) {
      return (
        <ApproveModalContent
          title={stepContents}
          isX={isXOrder(order)}
          // TODO
          isBonus={false}
          currencyA={currencyA as Currency}
          asBadge
          currentStep={confirmModalState}
          approvalModalSteps={pendingModalSteps.map((step) => step.step) as any}
        />
      )
    }

    // TODO: x wrap flow
    if (confirmModalState === ConfirmModalState.WRAPPING) {
      return (
        <SwapPendingModalContent
          title={t('Wrap')}
          currencyA={currencyA}
          currencyB={currencyA?.wrapped}
          amountA={amountAWithSlippage}
          amountB={amountAWithSlippage}
          currentStep={confirmModalState}
        >
          {showAddToWalletButton && (txHash || orderHash) ? (
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

    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION) {
      let title = txHash ? t('Transaction Submitted') : t('Confirm Swap')

      if (isXOrder(originalOrder)) {
        title = txHash ? t('Order Filled') : orderHash ? t('Order Submitted') : t('Confirm Swap')
      }
      return (
        <SwapPendingModalContent
          title={title}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
          currentStep={confirmModalState}
        >
          {showAddToWalletButton && (txHash || orderHash) ? (
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

    if (confirmModalState === ConfirmModalState.COMPLETED && txHash) {
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
          {showAddToWalletButton && (
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
          )}
        </SwapTransactionReceiptModalContent>
      )
    }

    return (
      <TransactionConfirmSwapContentV2
        order={order}
        recipient={recipient}
        originalOrder={originalOrder}
        allowedSlippage={allowedSlippage}
        currencyBalances={currencyBalances}
        onConfirm={onConfirm}
        onAcceptChanges={onAcceptChanges}
      />
    )
  }, [
    slippageAdjustedAmounts,
    currencyBalances,
    order,
    swapErrorMessage,
    confirmModalState,
    txHash,
    recipient,
    originalOrder,
    allowedSlippage,
    onConfirm,
    onAcceptChanges,
    chainId,
    t,
    handleDismiss,
    openSettingModal,
    stepContents,
    pendingModalSteps,
    showAddToWalletButton,
    orderHash,
    token,
  ])

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight={hasError ? 'auto' : '415px'}
      width={['100%', '100%', '100%', '480px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalState.REVIEWING || hasError}
      headerPadding={loadingAnimationVisible ? '12px 24px 0px 24px !important' : '12px 24px'}
      headerBackground="transparent"
      bodyPadding={loadingAnimationVisible && !hasError ? '0 24px 24px 24px' : '24px'}
      bodyTop={loadingAnimationVisible ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>{modalContent}</Box>
      {stepsVisible ? (
        <ApproveStepFlow
          confirmModalState={confirmModalState}
          pendingModalSteps={pendingModalSteps.map((step) => step.step) as any}
        />
      ) : null}
    </ConfirmSwapModalContainer>
  )
}
