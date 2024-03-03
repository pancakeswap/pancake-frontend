import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  CircleLoader,
  Flex,
  Heading,
  InjectedModalProps,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
  Text,
  useModal,
} from '@pancakeswap/uikit'

import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { MutableRefObject, memo, useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import OnRampProviderLogo from 'views/BuyCrypto/components/OnRampProviderLogo/OnRampProviderLogo'
import { useOnRampSignature } from 'views/BuyCrypto/hooks/useOnRampSignature'
import { StyledBackArrowContainer } from 'views/BuyCrypto/styles'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import { ErrorText } from 'views/Swap/components/styleds'
import { useAccount } from 'wagmi'
import { ProviderIFrame } from './ProviderIframe'

interface FiatOnRampProps {
  selectedQuote: OnRampProviderQuote | undefined
  cryptoCurrency: string | undefined
  externalTxIdRef: MutableRefObject<string | undefined>
  resetBuyCryptoState: () => void
}

function extractBeforeDashX(str) {
  const parts = str.split('-')
  return parts[1]
}

export const FiatOnRampModalButton = ({
  selectedQuote,
  cryptoCurrency,
  externalTxIdRef,
  disabled,
  loading,
  input,
  btcAddress,
  resetBuyCryptoState,
}: FiatOnRampProps & { disabled: boolean; loading: boolean; input: string; btcAddress: string }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const {
    data: sigData,
    isLoading,
    isError,
    refetch,
  } = useOnRampSignature({
    chainId: cryptoCurrency === 'BTC-bitcoin' ? 'bitcoin' : Number(extractBeforeDashX(cryptoCurrency)),
    quote: selectedQuote!,
    externalTransactionId: externalTxIdRef.current!,
    btcAddress,
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
      onPresentConfirmModal()
      // eslint-disable-next-line no-param-reassign
      externalTxIdRef.current = v4()
      refetch()
    },
    [onPresentConfirmModal, externalTxIdRef, refetch],
  )

  const buttonText = useMemo(() => {
    if (loading || isLoading || !selectedQuote) {
      return (
        <>
          <Flex alignItems="center">
            <Text px="4px" fontWeight="bold" color="white">
              {t('Fetching Quotes')}
            </Text>
            <CircleLoader stroke="white" />
          </Flex>
        </>
      )
    }
    if (cryptoCurrency === 'BTC-bitcoin' && input === '') return t('Verify your address to continue')
    if (cryptoCurrency === 'BTC-bitcoin' && disabled) return t('Invalid BTC address')
    return t(`Buy %amount% %currency% with %provider%`, {
      provider: selectedQuote?.provider,
      amount: selectedQuote?.quote.toFixed(3),
      currency: selectedQuote?.cryptoCurrency,
    })
  }, [loading, isLoading, selectedQuote, t, cryptoCurrency, disabled, input])

  if (cryptoCurrency !== 'BTC-bitcoin' && !account)
    return (
      <AutoColumn width="100%">
        <ConnectWalletButton height="50px" />
      </AutoColumn>
    )

  return (
    <AutoColumn width="100%">
      <CommitButton
        onClick={toggleFiatOnRampModal}
        disabled={disabled || isError}
        isLoading={isLoading || loading}
        height="56px"
      >
        {buttonText}
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
    <>
      <ModalWrapper minHeight="700px" minWidth="360px">
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
        {error || !selectedQuote || !iframeUrl ? (
          <Flex justifyContent="center" alignItems="center" alignContent="center">
            <ErrorText>
              <Trans>something went wrong!</Trans>
            </ErrorText>
          </Flex>
        ) : (
          <ProviderIFrame provider={selectedQuote?.provider} loading={loading} signedIframeUrl={iframeUrl} />
        )}
      </ModalWrapper>
    </>
  )
})

export default FiatOnRampModal
