import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  CircleLoader,
  Flex,
  Heading,
  InjectedModalProps,
  LoadingDot,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
  Text,
  useModal,
} from '@pancakeswap/uikit'

import { CommitButton } from 'components/CommitButton'
import { MutableRefObject, memo, useCallback, useMemo } from 'react'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import OnRampProviderLogo from 'views/BuyCrypto/components/OnRampProviderLogo/OnRampProviderLogo'
import { ONRAMP_PROVIDERS } from 'views/BuyCrypto/constants'
import { useOnRampSignature } from 'views/BuyCrypto/hooks/useOnRampSignature'
import { IFrameWrapper, StyledBackArrowContainer, StyledIframe } from 'views/BuyCrypto/styles'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import { ErrorText } from 'views/Swap/components/styleds'

interface FiatOnRampProps {
  selectedQuote: OnRampProviderQuote | undefined
  cryptoCurrency: string | undefined
  externalTxIdRef: MutableRefObject<string | undefined>
}

interface IProviderIFrameProps {
  provider: keyof typeof ONRAMP_PROVIDERS
  loading: boolean
  signedIframeUrl: string
}

const LoadingBuffer = ({ loading }: { loading: boolean }) => {
  if (!loading) return <></>
  return (
    <IFrameWrapper justifyContent="center" alignItems="center" style={{ zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LoadingDot />
        <CircleLoader />
      </div>
    </IFrameWrapper>
  )
}

const ProviderIFrame = ({ provider, loading, signedIframeUrl }: IProviderIFrameProps) => {
  const theme = useTheme()
  const providerIframeId = `${ONRAMP_PROVIDERS[provider].toLowerCase()}_iframe`

  if (provider === ONRAMP_PROVIDERS.MoonPay || provider === ONRAMP_PROVIDERS.Transak) {
    return (
      <>
        <LoadingBuffer loading={loading} />
        <StyledIframe
          id={providerIframeId}
          src={signedIframeUrl}
          title="fiat-onramp-iframe"
          isDark={theme.isDark}
          allow="camera;microphone;fullscreen;payment"
        />
      </>
    )
  }
  return (
    <>
      <LoadingBuffer loading={loading} />
      <IFrameWrapper id="mercuryo-widget" />;
    </>
  )
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
}: FiatOnRampProps & { disabled: boolean }) => {
  const { t } = useTranslation()
  const {
    data: sigData,
    isLoading,
    isError,
  } = useOnRampSignature({
    chainId: Number(extractBeforeDashX(cryptoCurrency)),
    quote: selectedQuote!,
    externalTransactionId: externalTxIdRef.current!,
  })

  const [onPresentConfirmModal] = useModal(
    <FiatOnRampModal
      selectedQuote={selectedQuote}
      iframeUrl={sigData?.signature}
      loading={isLoading}
      error={isError}
    />,
  )
  const toggleFiatOnRampModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onPresentConfirmModal()
      // eslint-disable-next-line no-param-reassign
      externalTxIdRef.current = v4()
    },
    [onPresentConfirmModal, externalTxIdRef],
  )

  const buttonText = useMemo(() => {
    if (disabled || !selectedQuote) {
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
    return t(`Buy with %provider%`, { provider: selectedQuote?.provider })
  }, [disabled, selectedQuote, t])

  return (
    <AutoColumn width="100%">
      <CommitButton onClick={toggleFiatOnRampModal} disabled={disabled} isLoading={disabled} height="52px">
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
>(function ConfirmSwapModalComp({ onDismiss, selectedQuote, iframeUrl, error, loading }) {
  const { t } = useTranslation()

  const theme = useTheme()
  const handleDismiss = useCallback(() => onDismiss?.(), [onDismiss])

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
