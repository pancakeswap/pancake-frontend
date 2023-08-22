import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  CircleLoader,
  Flex,
  Heading,
  InjectedModalProps,
  ModalTitle,
  ModalWrapper,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { LoadingDot } from '@pancakeswap/uikit/src/widgets/Liquidity'
import { CommitButton } from 'components/CommitButton'
import { MERCURYO_WIDGET_ID, MOONPAY_SIGN_URL, ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Script from 'next/script'
import { Dispatch, ReactNode, SetStateAction, memo, useCallback, useEffect, useState } from 'react'
import { useBuyCryptoActionHandlers } from 'state/buyCrypto/hooks'
import styled, { useTheme } from 'styled-components'
import OnRampProviderLogo from 'views/BuyCrypto/components/OnRampProviderLogo/OnRampProviderLogo'
import {
  ONRAMP_PROVIDERS,
  SUPPORTED_MERCURYO_FIAT_CURRENCIES,
  chainIdToNetwork,
  moonapyCurrencyChainidentifier,
  supportedTokenMap,
} from 'views/BuyCrypto/constants'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { ErrorText } from 'views/Swap/components/styleds'
import { useAccount } from 'wagmi'

export const StyledIframe = styled.iframe<{ isDark: boolean }>`
  height: 90%;
  width: 100%;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  position: absolute;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`

const IFrameWrapper = styled(Flex)`
  height: 90%;
  width: 100%;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => (theme.isDark ? '#27262C' : 'white')};
  position: absolute;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  padding-bottom: 18px;
`
const StyledBackArrowContainer = styled(Box)`
  position: absolute;
  right: 10%;
  &:hover {
    cursor: pointer;
  }
`

export const ModalHeader = styled.div<{ background?: string }>`
  align-items: center;
  background: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 12px 24px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ background }) => background || 'transparent'};
  }
`

interface FiatOnRampProps {
  provider: string
  inputCurrency: string
  outputCurrency: string
  amount: string
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
}

interface FetchResponse {
  urlWithSignature: string
}

const LoadingBuffer = () => {
  return (
    <IFrameWrapper justifyContent="center" alignItems="center" style={{ zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LoadingDot />
        <CircleLoader />
      </div>
    </IFrameWrapper>
  )
}

const fetchMoonPaySignedUrl = async (
  inputCurrency: string,
  outputCurrency: string,
  amount: string,
  isDark: boolean,
  account: string,
  chainId: number,
) => {
  try {
    const baseCurrency = `${inputCurrency.toLowerCase()}${moonapyCurrencyChainidentifier[chainId]}`

    const res = await fetch(`${MOONPAY_SIGN_URL}/generate-moonpay-sig`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        type: 'MOONPAY',
        defaultCurrencyCode: baseCurrency,
        baseCurrencyCode: outputCurrency.toLowerCase(),
        baseCurrencyAmount: amount,
        redirectUrl: 'https://pancakeswap.finance',
        theme: isDark ? 'dark' : 'light',
        showOnlyCurrencies: supportedTokenMap[chainId].moonPayTokens,
        walletAddress: account,
      }),
    })
    const result: FetchResponse = await res.json()

    return result.urlWithSignature
  } catch (error) {
    console.error('Error fetching signature:', error)
    return '' // Return an empty string in case of an error
  }
}

export const FiatOnRampModalButton = ({
  provider,
  inputCurrency,
  outputCurrency,
  amount,
  disabled,
  setModalView,
}: FiatOnRampProps & { disabled: boolean }) => {
  const { t } = useTranslation()
  const [onPresentConfirmModal] = useModal(
    <FiatOnRampModal
      provider={provider}
      inputCurrency={inputCurrency}
      outputCurrency={outputCurrency}
      amount={amount}
      setModalView={setModalView}
    />,
  )

  let buttonText: ReactNode | string = t(`Buy with %provider%`, { provider })
  if (disabled) {
    buttonText = (
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
  return (
    <AutoColumn gap="md">
      <CommitButton onClick={onPresentConfirmModal} disabled={disabled} isLoading={disabled} mb="10px" mt="16px">
        {buttonText}
      </CommitButton>
    </AutoColumn>
  )
}

export const FiatOnRampModal = memo<InjectedModalProps & FiatOnRampProps>(function ConfirmSwapModalComp({
  onDismiss,
  inputCurrency,
  outputCurrency,
  amount,
  provider,
  setModalView,
}) {
  const [scriptLoaded, setScriptOnLoad] = useState<boolean>(Boolean(window?.mercuryoWidget))

  const [error, setError] = useState<boolean | string | null>(false)
  const [signedIframeUrl, setSignedIframeUrl] = useState<string | null>(null)
  const [sig, setSig] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { onIsNewCustomer } = useBuyCryptoActionHandlers()

  const theme = useTheme()
  const account = useAccount()

  const handleDismiss = useCallback(async () => {
    onDismiss?.()
    setModalView(CryptoFormView.Input)
    try {
      const moonpayCustomerResponse = await fetch(
        `https://pcs-on-ramp-api.com/checkItem?searchAddress=${account.address}`,
      )
      const moonpayCustomerResult = await moonpayCustomerResponse.json()
      onIsNewCustomer(!moonpayCustomerResult.found)
    } catch (err) {
      throw new Error(`unable to fetch new customer status ${err}`)
    }
  }, [onDismiss, setModalView, onIsNewCustomer, account.address])

  const fetchSignedIframeUrl = useCallback(async () => {
    if (!account.address) {
      setError(t('Please connect an account before making a purchase.'))
      return
    }
    setLoading(true)
    setError(null)

    try {
      const result = await fetchMoonPaySignedUrl(
        inputCurrency,
        outputCurrency,
        amount,
        theme.isDark,
        account.address,
        chainId,
      )

      setSignedIframeUrl(result)
    } catch (e) {
      setError(e.toString())
    } finally {
      setTimeout(() => setLoading(false), 2000)
    }
  }, [account.address, theme.isDark, inputCurrency, outputCurrency, amount, t, chainId])

  useEffect(() => {
    const fetchSig = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${ONRAMP_API_BASE_URL}/generate-mercuryo-sig?walletAddress=${account.address}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        const signature = await res.json()
        setSig(signature.signature)
      } catch (e) {
        setError(e.toString())
      } finally {
        setTimeout(() => setLoading(false), 2000)
      }
    }
    fetchSig()
  }, [account.address])

  useEffect(() => {
    if (provider === ONRAMP_PROVIDERS.Mercuryo) {
      if (sig && window?.mercuryoWidget) {
        // @ts-ignore
        const MC_WIDGET = window?.mercuryoWidget
        MC_WIDGET.run({
          widgetId: MERCURYO_WIDGET_ID,
          fiatCurrency: outputCurrency.toUpperCase(),
          currency: inputCurrency.toUpperCase(),
          fiatAmount: amount,
          fixAmount: true,
          fixFiatAmount: true,
          fixFiatCurrency: true,
          fixCurrency: true,
          currencies: supportedTokenMap[chainId].mercuryoTokens,
          fiatCurrencies: SUPPORTED_MERCURYO_FIAT_CURRENCIES,
          address: account.address,
          signature: sig,
          network: chainIdToNetwork[chainId],
          host: document.getElementById('mercuryo-widget'),
          theme: theme.isDark ? 'PCS_dark' : 'PCS_light',
        })
      }
    } else fetchSignedIframeUrl()
  }, [
    fetchSignedIframeUrl,
    provider,
    sig,
    account.address,
    amount,
    inputCurrency,
    outputCurrency,
    theme,
    scriptLoaded,
    chainId,
  ])

  return (
    <>
      <ModalWrapper minHeight="700px" minWidth="360px">
        <ModalHeader background={theme.colors.gradientCardHeader}>
          <ModalTitle pt="6px" justifyContent="center">
            <StyledBackArrowContainer onClick={handleDismiss}>
              <Text color="primary">{t('Close')}</Text>
            </StyledBackArrowContainer>
            <Heading width="100%" textAlign="center" pr="20px">
              <OnRampProviderLogo provider={provider} />
            </Heading>
          </ModalTitle>
        </ModalHeader>
        {error ? (
          <Flex justifyContent="center" alignItems="center" alignContent="center">
            <ErrorText>
              <Trans>something went wrong!</Trans>
            </ErrorText>
          </Flex>
        ) : provider === ONRAMP_PROVIDERS.Mercuryo ? (
          <>
            {loading && <LoadingBuffer />}
            <IFrameWrapper id="mercuryo-widget" />;
          </>
        ) : (
          <>
            {loading && <LoadingBuffer />}
            <StyledIframe
              id="moonpayIframe"
              src={signedIframeUrl ?? ''}
              title="fiat-onramp-iframe"
              isDark={theme.isDark}
            />
          </>
        )}
      </ModalWrapper>
      <Script
        src="https://widget.mercuryo.io/embed.2.0.js"
        onLoad={() => {
          setScriptOnLoad(true)
        }}
      />
    </>
  )
})

export default FiatOnRampModal
