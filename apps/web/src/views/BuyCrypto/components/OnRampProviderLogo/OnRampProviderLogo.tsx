import type { Token } from '@pancakeswap/swap-sdk-core'
import { Box, Skeleton, TokenPairImage } from '@pancakeswap/uikit'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { getImageUrlFromToken } from 'components/TokenImage'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { ONRAMP_PROVIDERS, PROVIDER_ICONS, isNativeBtc } from 'views/BuyCrypto/constants'
import { OnRampIconCircleWrapper, OnRampIconContainer } from 'views/BuyCrypto/styles'

type ProviderLogoProps = {
  provider: keyof typeof ONRAMP_PROVIDERS | undefined
  size?: number
  loading?: boolean
}

const OnRampProviderLogo = ({ provider, size = 35, loading = false }: ProviderLogoProps) => {
  const defaultProvider = provider ?? ONRAMP_PROVIDERS.MoonPay
  const isLoading = Boolean(loading || !provider)
  const showBorder = Boolean(defaultProvider === ONRAMP_PROVIDERS.Mercuryo)
  const icon = PROVIDER_ICONS[defaultProvider]
  return (
    <OnRampIconContainer width={size} height={size}>
      <Skeleton isDark width={size} height={size} borderRadius="50%" display={!isLoading ? 'none' : 'block'} />
      <OnRampIconCircleWrapper width={size} height={size} border={showBorder} display={isLoading ? 'none' : 'block'}>
        <Image alt={`${provider}-logo`} src={icon} width={size} height={size} />
      </OnRampIconCircleWrapper>
    </OnRampIconContainer>
  )
}

export const EvmLogo = ({ mode, currency, size = 24 }: { mode: string; currency: Token; size?: number }) => {
  return (
    <>
      {mode === 'onramp-fiat' ? (
        <Box width={`${size}px`} height={`${size}px`}>
          <FiatLogo currency={currency} size={`${size - 3}px`} />
        </Box>
      ) : (
        <Box width={`${size}px`} height={`${size}px`}>
          <TokenPairImage
            width={size}
            height={size}
            primarySrc={getImageUrlFromToken(currency)}
            secondarySrc={currency ? `https://assets.pancakeswap.finance/web/chains/${currency.chainId}.png` : ''}
          />
        </Box>
      )}
    </>
  )
}
export const BtcLogo = ({ size = 24 }: { size?: number }) => (
  <Image src={`${ASSET_CDN}/web/onramp/btc.svg`} alt="bitcoin-logo" width={size} height={size} />
)

export const OnRampCurrencyLogo = ({ mode, currency, size = 28 }: { mode: string; currency: Token; size?: number }) => {
  const isBtc = isNativeBtc(currency)
  return isBtc ? <BtcLogo /> : <EvmLogo mode={mode} currency={currency as Token} size={size} />
}

export default OnRampProviderLogo
