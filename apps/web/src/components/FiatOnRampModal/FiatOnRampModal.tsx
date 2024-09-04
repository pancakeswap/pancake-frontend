import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  CircleLoader,
  Flex,
  Heading,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
  Text,
  useModal,
  type InjectedModalProps,
} from '@pancakeswap/uikit'

import type { Currency } from '@pancakeswap/swap-sdk-core'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { memo, useCallback, useMemo, type MutableRefObject } from 'react'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import OnRampProviderLogo from 'views/BuyCrypto/components/OnRampProviderLogo/OnRampProviderLogo'
import { useIsBtc } from 'views/BuyCrypto/hooks/useIsBtc'
import { useOnRampSignature } from 'views/BuyCrypto/hooks/useOnRampSignature'
import { IFrameWrapper, StyledBackArrowContainer } from 'views/BuyCrypto/styles'
import type { OnRampProviderQuote, OnRampUnit } from 'views/BuyCrypto/types'
import { ErrorText } from 'views/Swap/components/styleds'
import { useAccount } from 'wagmi'
import { logGTMFiatOnRampModalEvent } from 'utils/customGTMEventTracking'
import { ProviderIFrame } from './ProviderIframe'

interface FiatOnRampProps {
  selectedQuote: OnRampProviderQuote | undefined
  cryptoCurrency: Currency | undefined
  externalTxIdRef: MutableRefObject<string | undefined>
  resetBuyCryptoState: () => void
}

export const FiatOnRampModalButton = ({
  selectedQuote,
  cryptoCurrency,
  externalTxIdRef,
  disabled,
  loading,
  btcAddress,
  resetBuyCryptoState,
  errorText,
  onRampUnit,
}: FiatOnRampProps & {
  disabled: boolean
  loading: boolean
  btcAddress: string
  errorText: string | undefined
  onRampUnit: OnRampUnit
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const isBtc = useIsBtc()

  const {
    data: sigData,
    isLoading,
    isError,
    refetch,
  } = useOnRampSignature({
    chainId: cryptoCurrency?.chainId,
    quote: selectedQuote,
    externalTransactionId: externalTxIdRef.current,
    btcAddress,
    onRampUnit,
  })

  const [onPresentConfirmModal] = useModal(
    <FiatOnRampModal
      selectedQuote={selectedQuote}
      iframeUrl={sigData?.signature}
      loading={isLoading}
      error={isError}
      resetBuyCryptoState={resetBuyCryptoState}
    />,
  )
  const toggleFiatOnRampModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      logGTMFiatOnRampModalEvent(selectedQuote?.provider)

      onPresentConfirmModal()
      // eslint-disable-next-line no-param-reassign
      externalTxIdRef.current = v4()
      refetch()
    },
    [selectedQuote?.provider, onPresentConfirmModal, externalTxIdRef, refetch],
  )

  const buttonText = useMemo(() => {
    const provider = selectedQuote?.provider

    if (errorText) return errorText
    if (isBtc && btcAddress === '') return t('Verify your address to continue')
    if (isBtc && disabled) return t('Invalid BTC address')
    if (loading || isLoading) return t('Fetching Quotes')

    return t('Buy with %provider%', { provider })
  }, [loading, isLoading, selectedQuote, t, isBtc, disabled, btcAddress, errorText])

  if (!isBtc && !account)
    return (
      <AutoColumn width="100%">
        <ConnectWalletButton height="50px" />
      </AutoColumn>
    )

  return (
    <AutoColumn width="100%">
      <CommitButton
        onClick={toggleFiatOnRampModal}
        disabled={Boolean(disabled || isError || errorText)}
        isLoading={isLoading || loading}
        height="56px"
      >
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {buttonText}
          </Text>
          {isLoading || (loading && !errorText && <CircleLoader stroke="white" />)}
        </Flex>
      </CommitButton>
    </AutoColumn>
  )
}

export const FiatOnRampModal = memo<
  InjectedModalProps &
    Omit<FiatOnRampProps, 'cryptoCurrency' | 'externalTxIdRef'> & {
      iframeUrl: string | undefined
      loading: boolean
      error: boolean
    }
>(function ConfirmSwapModalComp({ onDismiss, selectedQuote, iframeUrl, error, loading, resetBuyCryptoState }) {
  const { t } = useTranslation()
  const theme = useTheme()

  const handleDismiss = useCallback(() => {
    resetBuyCryptoState?.()
    onDismiss?.()
  }, [onDismiss, resetBuyCryptoState])

  return (
    <ModalWrapper>
      <ModalHeader background={theme.colors.gradientCardHeader}>
        <ModalTitle pt="6px" justifyContent="center">
          <StyledBackArrowContainer onClick={handleDismiss}>
            <Text color="primary">{t('Close')}</Text>
          </StyledBackArrowContainer>
          <Heading width="100%" textAlign="center" pr="20px">
            <OnRampProviderLogo provider={selectedQuote?.provider} />
          </Heading>
        </ModalTitle>
      </ModalHeader>
      <ModalBody position="relative" style={{ alignItems: 'center', overflowY: 'hidden' }}>
        {error || !selectedQuote || !iframeUrl ? (
          <IFrameWrapper justifyContent="center" alignItems="center">
            <ErrorText>
              <Trans>something went wrong!</Trans>
            </ErrorText>
          </IFrameWrapper>
        ) : (
          <ProviderIFrame provider={selectedQuote?.provider} loading={loading} signedIframeUrl={iframeUrl} />
        )}
      </ModalBody>
    </ModalWrapper>
  )
})

export default FiatOnRampModal
