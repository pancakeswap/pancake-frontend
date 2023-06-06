import { Trans, useTranslation } from '@pancakeswap/localization'
import { Button, Flex, InjectedModalProps, Modal, Spinner, useModal } from '@pancakeswap/uikit'
import { LoadingDot } from '@pancakeswap/uikit/src/widgets/Liquidity'
import { useFiatOnrampAvailability } from 'hooks/useCheckAvailability'
import { memo, useCallback, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ErrorText } from 'views/Swap/components/styleds'
import { useAccount } from 'wagmi'

const StyledIframe = styled.iframe<{ isDark: boolean }>`
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

export const FiatOnRampModalButton = () => {
  const { t } = useTranslation()
  const [shouldCheck, setShouldCheck] = useState<boolean>(false)
  const [onPresentConfirmModal] = useModal(<FiatOnRampModal />)

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

  return (
    <>
      {!disableBuyCryptoButton ? (
        <Button height="35px" onClick={handleBuyCryptoClick} disabled={false} isLoading={false} variant="secondary">
          {t('Buy Crypto')}
        </Button>
      ) : null}
    </>
  )
}

export const FiatOnRampModal = memo<InjectedModalProps>(function ConfirmSwapModalComp({ onDismiss }) {
  const [error, setError] = useState<boolean | string | null>(false)
  const [signedIframeUrl, setSignedIframeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const theme = useTheme()
  const account = useAccount()
  const { t } = useTranslation()

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
      const res = await fetch(`/api/onramp-url-sign/sign-moonpay-url`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          type: 'MOONPAY',
          defaultCurrencyCode: 'eth',
          redirectUrl: 'https://app.uniswap.org/#/swap',
          theme: theme.isDark ? 'dark' : 'light',
          walletAddresses: JSON.stringify(
            MOONPAY_SUPPORTED_CURRENCY_CODES.reduce(
              (acc, currencyCode) => ({
                ...acc,
                [currencyCode]: account.address,
              }),
              {},
            ),
          ),
        }),
      })
      const result = await res.json()
      setSignedIframeUrl(result.urlWithSignature)
    } catch (e) {
      setError(e.toString())
    } finally {
      setLoading(false)
    }
  }, [account.address, theme.isDark, t])

  useEffect(() => {
    fetchSignedIframeUrl()
  }, [fetchSignedIframeUrl])

  return (
    <>
      <Modal
        title="Buy Crypto In One Click"
        onDismiss={handleDismiss}
        bodyPadding="0px"
        headerBackground="gradientCardHeader"
        height="650px" // height has to be overidden
        width="350px" // width has to be overidden
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
        ) : (
          <StyledIframe
            id="moonpayIframe"
            src={signedIframeUrl ?? ''}
            frameBorder="0"
            title="fiat-onramp-iframe"
            isDark={theme.isDark}
          />
        )}
      </Modal>
    </>
  )
})

export default FiatOnRampModal
