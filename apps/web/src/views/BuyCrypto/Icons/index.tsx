import { useTheme } from 'styled-components'
import Image from 'next/image'
import { ReactNode } from 'react'
import { MercuryoSvg, MoonPaySvg } from './Icons'
import { ONRAMP_PROVIDERS } from '../constants'

export const ProviderIcon: React.FC<
  { provider: keyof typeof ONRAMP_PROVIDERS; isDisabled: boolean } & (React.SVGProps<SVGSVGElement> &
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ provider, isDisabled }: any) => {
  const theme = useTheme()
  const providerToLogo: { [key: string]: ReactNode } = {
    MoonPay: <MoonPaySvg opacity={isDisabled ? '0.3' : '1'} />,
    Mercuryo: <MercuryoSvg opacity={isDisabled ? '0.3' : '1'} isDark={theme.isDark} />,
    Transak: <Image src="/images/on-ramp-providers/transak-offical-logo.png" alt="pcs" width={100} height={100} />,
  }
  const logo = providerToLogo[provider]
  return logo
}
