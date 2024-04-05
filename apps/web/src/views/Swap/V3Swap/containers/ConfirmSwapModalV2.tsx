import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { Box, BscScanIcon, Column, Flex, InjectedModalProps, Link, Text } from '@pancakeswap/uikit'
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
import DescriptionWithTx from 'components/Toast/DescriptionWithTx'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import ConfirmSwapModalContainer from 'views/Swap/components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from 'views/Swap/components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { ConfirmAction } from '../hooks/useConfirmModalStateV2'
import { AllowedAllowanceState } from '../types'
import { ApproveStepFlowV2 } from './ApproveStepFlowV2'

export const useApprovalPhaseStepTitles: ({
  trade,
}: {
  trade: Pick<SmartRouterTrade<TradeType>, 'inputAmount'> | undefined
}) => {
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

type ConfirmSwapModalProps = InjectedModalProps & {
  customOnDismiss?: () => void
  onDismiss?: () => void
  confirmModalState: ConfirmModalState
  pendingModalSteps: ConfirmAction[]
  isMM?: boolean
  isRFQReady?: boolean
  trade?: SmartRouterTrade<TradeType> | V4Router.V4Trade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType> | V4Router.V4Trade<TradeType>
  currencyBalances?: { [field in Field]?: CurrencyAmount<Currency> }
  txHash?: string
  swapErrorMessage?: string
  onAcceptChanges: () => void
  onConfirm: (setConfirmModalState?: () => void) => void
  openSettingModal?: () => void
}

export const ConfirmSwapModalV2: React.FC<ConfirmSwapModalProps> = ({
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
  const hasError = useMemo(() => swapErrorMessage !== undefined, [swapErrorMessage])
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

  const showAddToWalletButton = useMemo(() => {
    if (token && trade?.outputAmount?.currency) {
      return !trade?.outputAmount?.currency?.isNative
    }
    return false
  }, [token, trade])

  const handleDismiss = useCallback(() => {
    if (typeof customOnDismiss === 'function') {
      customOnDismiss()
    }

    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const modalContent = useMemo(() => {
    const currencyA = currencyBalances?.INPUT?.currency ?? trade?.inputAmount?.currency
    const currencyB = currencyBalances?.OUTPUT?.currency ?? trade?.outputAmount?.currency
    const amountA = formatAmount(trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(trade?.outputAmount, 6) ?? ''

    if (swapErrorMessage) {
      const errorMessage =
        txHash && isMM ? (
          <Column style={{ margin: '0 -12rem' }} alignItems="center">
            <DescriptionWithTx txHash={txHash} txChainId={chainId}>
              <Text color="failure" mb="16px">
                {t('Transaction failed: quote expired')}
              </Text>
            </DescriptionWithTx>
          </Column>
        ) : (
          swapErrorMessage
        )
      return (
        <Flex width="100%" alignItems="center" height="calc(430px - 73px - 120px)">
          <SwapTransactionErrorContent
            message={errorMessage}
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
          {showAddToWalletButton && txHash ? (
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
    showAddToWalletButton,
  ])

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight={hasError ? 'auto' : '415px'}
      width={['100%', '100%', '100%', '367px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalState.REVIEWING || hasError}
      headerPadding={loadingAnimationVisible ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={loadingAnimationVisible && !hasError ? '0 24px 24px 24px' : '24px'}
      bodyTop={loadingAnimationVisible ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>{modalContent}</Box>
      {stepsVisible ? (
        <ApproveStepFlowV2
          confirmModalState={confirmModalState}
          pendingModalSteps={pendingModalSteps.map((step) => step.step) as any}
        />
      ) : null}
    </ConfirmSwapModalContainer>
  )
}
