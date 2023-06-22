import { Trans, useTranslation } from '@pancakeswap/localization'
import { AutoColumn, CircleLoader, Flex, InjectedModalProps, Modal, Text, useModal } from '@pancakeswap/uikit'
import { LoadingDot } from '@pancakeswap/uikit/src/widgets/Liquidity'
import { CommitButton } from 'components/CommitButton'
import { useFiatOnrampAvailability } from 'hooks/useCheckAvailability'
import Script from 'next/script'
import { ReactNode, memo, useCallback, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ErrorText } from 'views/Swap/components/styleds'
import { useAccount } from 'wagmi'
import { MOONPAY_SUPPORTED_CURRENCY_CODES, SUPPORTED_MERCURYO_FIAT_CURRENCIES } from 'views/BuyCrypto/constants'

export const StyledIframe = styled.iframe<{ isDark: boolean }>`
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;

  height: calc(100% - 75px);
  position: absolute;
  width: 100%;
`

interface FiatOnRampProps {
  provider: string
  inputCurrency: string
  outputCurrency: string
  amount: string
}

interface FetchResponse {
  urlWithSignature: string
}

const fetchMoonPaySignedUrl = async (
  inputCurrency: string,
  outputCurrency: string,
  amount: string,
  isDark: boolean,
  account: string,
) => {
  try {
    const res = await fetch(`https://pcs-onramp-api.com/generate-moonpay-sig`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        type: 'MOONPAY',
        defaultCurrencyCode: inputCurrency.toLowerCase(),
        baseCurrencyCode: outputCurrency.toLowerCase(),
        baseCurrencyAmount: amount,
        redirectUrl: 'https://pancakeswap.finance',
        theme: isDark ? 'dark' : 'light',
        // showOnlyCurrencies: MOONPAY_SUPPORTED_CURRENCY_CODES,
        walletAddresses: JSON.stringify(
          MOONPAY_SUPPORTED_CURRENCY_CODES.reduce(
            (acc, currencyCode) => ({
              ...acc,
              [currencyCode]: account,
            }),
            {},
          ),
        ),
      }),
    })
    const result: FetchResponse = await res.json()
    return result.urlWithSignature
  } catch (error) {
    console.error('Error fetching signature:', error)
    return '' // Return an empty string in case of an error
  }
}

const fetchBinanceConnectSignedUrl = async (inputCurrency, outputCurrency, amount, account) => {
  try {
    const res = await fetch(`https://pcs-onramp-api.com/generate-binance-connect-sig`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        cryptoCurrency: inputCurrency.toUpperCase() === 'WBTC' ? 'BTC' : inputCurrency.toUpperCase(),
        fiatCurrency: outputCurrency.toUpperCase(),
        amount,
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
}: FiatOnRampProps & { disabled: boolean }) => {
  const { t } = useTranslation()
  const [shouldCheck, setShouldCheck] = useState<boolean>(false)
  const [onPresentConfirmModal] = useModal(
    <FiatOnRampModal
      provider={provider}
      inputCurrency={inputCurrency}
      outputCurrency={outputCurrency}
      amount={amount}
    />,
  )

  const { fiatOnarampAvailability, availabilityChecked, loading, error } = useFiatOnrampAvailability(
    shouldCheck,
    onPresentConfirmModal,
  )

  const handleBuyCryptoClick = useCallback(() => {
    if (!availabilityChecked) {
      setShouldCheck(true)
    } else if (fiatOnarampAvailability) {
      onPresentConfirmModal()
      setShouldCheck(false)
    }
  }, [fiatOnarampAvailability, availabilityChecked, onPresentConfirmModal])

  const disableBuyCryptoButton = Boolean(error || (!fiatOnarampAvailability && availabilityChecked) || loading)

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
    <>
      {!disableBuyCryptoButton ? (
        <AutoColumn gap="md">
          <CommitButton onClick={handleBuyCryptoClick} disabled={disabled} isLoading={disabled} mb="10px" mt="16px">
            {buttonText}
          </CommitButton>
        </AutoColumn>
      ) : null}
    </>
  )
}

export const FiatOnRampModal = memo<InjectedModalProps & FiatOnRampProps>(function ConfirmSwapModalComp({
  onDismiss,
  inputCurrency,
  outputCurrency,
  amount,
  provider,
}) {
  const [error, setError] = useState<boolean | string | null>(false)
  const [signedIframeUrl, setSignedIframeUrl] = useState<string | null>(null)
  const [sig, setSig] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  const theme = useTheme()
  const account = useAccount()
  // const { t } = useTranslation()

  const handleDismiss = useCallback(() => {
    onDismiss?.()
  }, [onDismiss])

  const fetchSignedIframeUrl = useCallback(async () => {
    if (!account.address) {
      setError(t('Please connect an account before making a purchase.'))
      return
    }
    setLoading(true)
    setError(null)

    try {
      let result = ''
      if (provider === 'MoonPay')
        result = await fetchMoonPaySignedUrl(inputCurrency, outputCurrency, amount, theme.isDark, account.address)
      else result = await fetchBinanceConnectSignedUrl(inputCurrency, outputCurrency, amount, account.address)

      setSignedIframeUrl(result)
    } catch (e) {
      setError(e.toString())
    } finally {
      setTimeout(() => setLoading(false), 2000)
    }
  }, [account.address, theme.isDark, inputCurrency, outputCurrency, amount, provider, t])

  useEffect(() => {
    const fetchSig = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`https://pcs-onramp-api.com/generate-mercuryo-sig?walletAddress=${account.address}`, {
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
    if (provider === 'Mercuryo') {
      if (sig) {
        // @ts-ignore
        const MC_WIDGET = mercuryoWidget
        MC_WIDGET.run({
          widgetId: '293d4864-20ca-4b46-965b-2544b97cbbf5',
          fiatCurrency: outputCurrency.toUpperCase(),
          currency: inputCurrency.toUpperCase(),
          fiatAmount: amount,
          fiatCurrencies: SUPPORTED_MERCURYO_FIAT_CURRENCIES,
          address: account.address,
          signature: sig,
          height: '700px',
          width: '400px',
          host: document.getElementById('mercuryo-widget'),
          theme: theme.isDark ? 'xzen' : 'phemex',
        })
      }
    } else fetchSignedIframeUrl()
  }, [fetchSignedIframeUrl, provider, sig, account.address, amount, inputCurrency, outputCurrency, theme])

  return (
    <>
      <Modal
        title="Buy Crypto In One Click"
        onDismiss={handleDismiss}
        bodyPadding="0px"
        headerBackground="gradientCardHeader"
        height="700px" // height has to be overidden
        width="400px" // width has to be overidden
      >
        {error ? (
          <Flex justifyContent="center" alignItems="center" alignContent="center">
            <ErrorText>
              <Trans>something went wrong!</Trans>
            </ErrorText>
          </Flex>
        ) : provider === 'Mercuryo' ? (
          <div id="mercuryo-widget" />
        ) : (
          <>
            {loading && (
              <Flex
                justifyContent="center"
                alignItems="center"
                style={{
                  height: '630px',
                  width: '100%',
                  background: `${theme.isDark ? '#27262C' : 'white'}`,
                  position: 'absolute',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px',
                  zIndex: '100',
                }}
              >
                <div style={{ marginBottom: '70px', display: 'flex', alignItems: 'center' }}>
                  <LoadingDot />
                  <CircleLoader />
                </div>
              </Flex>
            )}

            <StyledIframe
              id="moonpayIframe"
              src={signedIframeUrl ?? ''}
              title="fiat-onramp-iframe"
              isDark={theme.isDark}
            />
          </>
        )}
        <Script src="https://widget.mercuryo.io/embed.2.0.js" />
        <div id="mercuryo-widget" />
      </Modal>
    </>
  )
})

export default FiatOnRampModal
