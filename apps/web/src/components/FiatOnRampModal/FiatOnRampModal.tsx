import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  CircleLoader,
  Flex,
  Heading,
  InjectedModalProps,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
  Text,
  useModal,
} from '@pancakeswap/uikit'

import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { MERCURYO_WIDGET_ID, MERCURYO_WIDGET_URL } from 'config/constants/endpoints'
import Script from 'next/script'
import { MutableRefObject, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import OnRampProviderLogo from 'views/BuyCrypto/components/OnRampProviderLogo/OnRampProviderLogo'
import { ONRAMP_PROVIDERS, OnRampChainId, getOnrampCurrencyChainId, isNativeBtc } from 'views/BuyCrypto/constants'
import { useOnRampSignature } from 'views/BuyCrypto/hooks/useOnRampSignature'
import { IFrameWrapper, StyledBackArrowContainer } from 'views/BuyCrypto/styles'
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

export const FiatOnRampModalButton = ({
  selectedQuote,
  cryptoCurrency,
  externalTxIdRef,
  disabled,
  loading,
  input,
  btcAddress,
  resetBuyCryptoState,
  errorText,
}: FiatOnRampProps & {
  disabled: boolean
  loading: boolean
  input: string
  btcAddress: string
  errorText: string | undefined
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const isBtc = isNativeBtc(cryptoCurrency)
  const {
    data: sigData,
    isLoading,
    isError,
    refetch,
  } = useOnRampSignature({
    chainId: getOnrampCurrencyChainId(cryptoCurrency),
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
      account={isBtc ? btcAddress : account}
      chainId={getOnrampCurrencyChainId(cryptoCurrency)}
      txId={externalTxIdRef.current}
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
    const provider = selectedQuote?.provider

    if (errorText) return errorText
    if (isBtc && input === '') return t('Verify your address to continue')
    if (isBtc && disabled) return t('Invalid BTC address')
    if (loading || isLoading) return t('Fetching Quotes')

    return t('Buy with %provider%', { provider })
  }, [loading, isLoading, selectedQuote, t, isBtc, disabled, input, errorText])

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
      account: `0x${string}` | string | undefined
      chainId: OnRampChainId
      txId: string | undefined
    }
>(function ConfirmSwapModalComp({
  onDismiss,
  selectedQuote,
  iframeUrl,
  error,
  loading,
  resetBuyCryptoState,
  account,
  chainId,
  txId,
}) {
  const [scriptLoaded, setScriptOnLoad] = useState<boolean>(Boolean(window?.mercuryoWidget))
  const { t } = useTranslation()

  const theme = useTheme()
  const handleDismiss = useCallback(() => {
    resetBuyCryptoState?.()
    onDismiss?.()
  }, [onDismiss, resetBuyCryptoState])

  useEffect(() => {
    if (selectedQuote && selectedQuote.provider === ONRAMP_PROVIDERS.Mercuryo && account && iframeUrl) {
      const sigParam = iframeUrl.match(/[?&]signature=([^&]+)/)
      const sig = sigParam ? sigParam[1] : null

      if (window?.mercuryoWidget && sig) {
        // @ts-ignore
        const MC_WIDGET = window?.mercuryoWidget
        MC_WIDGET.run({
          widgetId: MERCURYO_WIDGET_ID,
          fiatCurrency: selectedQuote.fiatCurrency.toUpperCase(),
          currency: selectedQuote.cryptoCurrency.toUpperCase(),
          fiatAmount: selectedQuote.amount,
          fixAmount: true,
          fixFiatAmount: true,
          fixFiatCurrency: true,
          fixCurrency: true,
          address: account,
          signature: sig,
          network: chainId,
          merchantTransactionId: `${account}_${txId}`,
          host: document.getElementById('mercuryo-widget'),
          theme: theme.isDark ? 'PCS_dark' : 'PCS_light',
        })
      }
    }
  }, [selectedQuote, theme, scriptLoaded, chainId, account, iframeUrl, txId])

  return (
    <>
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
      <Script
        src={MERCURYO_WIDGET_URL}
        onLoad={() => {
          setScriptOnLoad(true)
        }}
      />
    </>
  )
})

export default FiatOnRampModal
