/* eslint-disable import/no-absolute-path */
/* eslint-disable global-require */
import { Token } from '@pancakeswap/swap-sdk-core'
import { Box, Skeleton, TokenPairImage } from '@pancakeswap/uikit'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { getImageUrlFromToken } from 'components/TokenImage'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/image'
import { HtmlHTMLAttributes } from 'react'
import { ONRAMP_PROVIDERS, isNativeBtc } from 'views/BuyCrypto/constants'

const PROVIDER_ICONS = {
  [ONRAMP_PROVIDERS.MoonPay]: `${ASSET_CDN}/web/onramp/moonpay.svg`,
  [ONRAMP_PROVIDERS.Mercuryo]: `${ASSET_CDN}/web/onramp/mercuryo.svg`,
  [ONRAMP_PROVIDERS.Transak]: `${ASSET_CDN}/web/onramp/transak.svg`,
} satisfies Record<keyof typeof ONRAMP_PROVIDERS, any>

const OnRampProviderLogo = ({
  provider,
  size = 35,
  loading = false,
}: {
  provider: keyof typeof ONRAMP_PROVIDERS | undefined
  size?: number
  loading?: boolean
  styles?: HtmlHTMLAttributes<any>
}) => {
  return (
    <>
      {loading || !provider ? (
        <Skeleton isDark width={size} height={size} borderRadius="50%" marginTop="7px" />
      ) : (
        <Image alt={`${provider}-logo`} src={PROVIDER_ICONS[provider]} width={size} height={size} />
      )}
    </>
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
            secondarySrc={`https://assets.pancakeswap.finance/web/chains/${currency.chainId}.png`}
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
