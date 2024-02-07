import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
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
import { useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import ConfirmSwapModalContainer from 'views/Swap/components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from 'views/Swap/components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { ConfirmAction } from '../hooks/useConfirmModalState'
import { AllowedAllowanceState } from '../types'
import { ApproveStepFlow } from './ApproveStepFlow'

export const useApprovalPhaseStepTitles: ({ trade }: { trade: SmartRouterTrade<TradeType> | undefined }) => {
  [step in AllowedAllowanceState]: string
} = ({ trade }: { trade: SmartRouterTrade<TradeType> | undefined }) => {
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

type ConfirmSwapModalProps = InjectedModalProps & {
  customOnDismiss?: () => void
  onDismiss?: () => void
  confirmModalState: ConfirmModalState
  pendingModalSteps: ConfirmAction[]
  isMM?: boolean
  isRFQReady?: boolean
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  txHash?: string
  swapErrorMessage?: string
  onAcceptChanges: () => void
  onConfirm: (setConfirmModalState?: () => void) => void
  openSettingModal?: () => void
}

export const ConfirmSwapModal: React.FC<ConfirmSwapModalProps> = ({
  confirmModalState,
  pendingModalSteps,
  customOnDismiss,
  swapErrorMessage,
  onDismiss,
  isMM,
  isRFQReady,
  trade,
  originalTrade,
  txHash,
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
  const stepsVisible = useMemo(() => {
    if (swapErrorMessage) return false
    if (confirmModalState === ConfirmModalState.REVIEWING || confirmModalState === ConfirmModalState.COMPLETED)
      return false
    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION && txHash) return false
    return pendingModalSteps.length > 0 && pendingModalSteps.some((step) => step.showIndicator)
  }, [confirmModalState, pendingModalSteps, swapErrorMessage, txHash])

  const stepContents = useApprovalPhaseStepTitles({ trade })
  const token: Token | undefined = useMemo(
    () => wrappedCurrency(trade?.outputAmount?.currency, chainId),
    [chainId, trade?.outputAmount?.currency],
  )

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
    if (
      confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
      confirmModalState === ConfirmModalState.PERMITTING ||
      confirmModalState === ConfirmModalState.RESETTING_APPROVAL
    ) {
      return (
        <ApproveModalContent
          title={stepContents}
          isMM={isMM}
          // TODO
          isBonus={false}
          currencyA={currencyA as Currency}
          asBadge
          currentStep={confirmModalState}
          approvalModalSteps={pendingModalSteps.map((step) => step.step) as any}
        />
      )
    }

    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION) {
      return (
        <SwapPendingModalContent
          title={txHash ? t('Transaction Submitted') : t('Confirm Swap')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
          currentStep={confirmModalState}
        >
          {txHash ? (
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
    chainId,
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
    token,
    trade,
    txHash,
  ])

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalState.REVIEWING || swapErrorMessage !== undefined}
      headerPadding={loadingAnimationVisible ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={loadingAnimationVisible ? '0 24px 24px 24px' : '24px'}
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
