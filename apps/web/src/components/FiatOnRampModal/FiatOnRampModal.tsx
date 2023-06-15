import { Trans, useTranslation } from '@pancakeswap/localization'
import { AutoColumn, CircleLoader, Flex, InjectedModalProps, Modal, Spinner, Text, useModal } from '@pancakeswap/uikit'
import { LoadingDot } from '@pancakeswap/uikit/src/widgets/Liquidity'
import { CommitButton } from 'components/CommitButton'
import { useFiatOnrampAvailability } from 'hooks/useCheckAvailability'
import Script from 'next/script'
import { ReactNode, memo, useCallback, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ErrorText } from 'views/Swap/components/styleds'
import { s } from 'vitest/dist/types-e3c9754d'
import { useAccount } from 'wagmi'

export const StyledIframe = styled.iframe<{ isDark: boolean }>`
  // #1c1c1e is the background color for the darkmode moonpay iframe as of 2/16/2023
  // background-color: #1c1c1e;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;

  height: calc(100% - 75px);
  position: absolute;
  // right: 0;
  width: 100%;
`

const MOONPAY_SUPPORTED_CURRENCY_CODES = [
  'eth',
  'eth_arbitrum',
  'eth_optimism',
  'eth_polygon',
  'weth',
  'wbtc',
  'matic_polygon',
  'polygon',
  'usdc_arbitrum',
  'usdc_optimism',
  'usdc_polygon',
]
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
  isDark: any,
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

  let buttonText: ReactNode | string = t(`Buy with ${provider}`)
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
          <CommitButton onClick={handleBuyCryptoClick} disabled={disabled} isLoading={disabled} mb="8px" mt="16px">
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

  const theme = useTheme()
  const account = useAccount()
  // const { t } = useTranslation()

  const handleDismiss = useCallback(() => {
    onDismiss?.()
  }, [onDismiss])

  const fetchSignedIframeUrl = useCallback(async () => {
    if (!account.address) {
      setError('Please connect an account before making a purchase.')
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
      setLoading(false)
    }
  }, [account.address, theme.isDark, inputCurrency, outputCurrency, amount, provider])

  useEffect(() => {
    const fetchSig = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/onramp-url-sign/generate-mercuryo-sig`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            walletAddress: account.address,
          }),
        })
        const signature = await res.json()
        setSig(signature.urlWithSignature)
      } catch (e) {
        setError(e.toString())
      } finally {
        setLoading(false)
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
          widgetId: '308e14df-01d7-4f35-948c-e17fa64bbc0d',
          fiatCurrency: outputCurrency.toUpperCase(),
          currency: inputCurrency.toUpperCase(),
          fiatAmount: amount,
          address: account.address,
          signature: sig,
          height: '650px',
          width: '400px',
          host: document.getElementById('mercuryo-widget'),
        })
      }
    } else fetchSignedIframeUrl()
  }, [fetchSignedIframeUrl, provider, sig, account.address, amount, inputCurrency, outputCurrency])

  return (
    <>
      <Modal
        title="Buy Crypto In One Click"
        onDismiss={handleDismiss}
        bodyPadding="0px"
        headerBackground="gradientCardHeader"
        height="650px" // height has to be overidden
        width="400px" // width has to be overidden
      >
        {error ? (
          <Flex justifyContent="center" alignItems="center" alignContent="center">
            <ErrorText>
              <Trans>something went wrong!</Trans>
            </ErrorText>
          </Flex>
        ) : loading ? (
          <Flex flexDirection="column" justifyContent="center" alignItems="center" alignContent="center">
            <Spinner />
            <LoadingDot />
          </Flex>
        ) : provider === 'Mercuryo' ? (
          <div id="mercuryo-widget" />
        ) : (
          <StyledIframe
            id="moonpayIframe"
            src={signedIframeUrl ?? ''}
            frameBorder="0"
            title="fiat-onramp-iframe"
            isDark={theme.isDark}
          />
        )}
        <Script src="https://sandbox-widget.mrcr.io/embed.2.0.js" />
        <div id="mercuryo-widget" />
      </Modal>
    </>
  )
})

export default FiatOnRampModal
