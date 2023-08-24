import { useTheme } from 'styled-components'
import Image from 'next/image'
import { MercuryoSvg, MoonPaySvg } from './Icons'

export const ProviderIcon: React.FC<
  { provider: string; isDisabled: boolean } & (React.SVGProps<SVGSVGElement> &
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ provider, isDisabled }: any) => {
  const theme = useTheme()
  const ProviderToLogo: { [key: string]: JSX.Element } = {
    MoonPay: <MoonPaySvg opacity={isDisabled ? '0.3' : '1'} />,
    Mercuryo: <MercuryoSvg opacity={isDisabled ? '0.3' : '1'} isDark={theme.isDark} />,
    Transak: <Image src="/images/logo_transparent.png" alt="pcs" width={100} height={100} />,
  }
  const Logo = ProviderToLogo[provider]
  return Logo
}
