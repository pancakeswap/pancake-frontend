/* eslint-disable import/no-absolute-path */
/* eslint-disable global-require */
import { Skeleton } from '@pancakeswap/uikit'
import Image from 'next/image'
import { HtmlHTMLAttributes } from 'react'
import { ONRAMP_PROVIDERS } from 'views/BuyCrypto/constants'

const PROVIDER_ICONS = {
  [ONRAMP_PROVIDERS.MoonPay]: require('/public/images/on-ramp-providers/moonpay.svg'),
  [ONRAMP_PROVIDERS.Mercuryo]: require('/public/images/on-ramp-providers/mercuryo.svg'),
  [ONRAMP_PROVIDERS.Transak]: require('/public/images/on-ramp-providers/transak.svg'),
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

export default OnRampProviderLogo
