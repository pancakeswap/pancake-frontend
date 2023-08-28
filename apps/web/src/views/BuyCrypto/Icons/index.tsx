import { useTheme } from 'styled-components'
import { MercuryoSvg, MoonPaySvg } from './Icons'

export const ProviderIcon: React.FC<
  { provider: string; isDisabled: boolean } & (React.SVGProps<SVGSVGElement> &
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ provider, isDisabled }: any) => {
  const theme = useTheme()
  const providerToLogo: { [key: string]: JSX.Element } = {
    MoonPay: <MoonPaySvg opacity={isDisabled ? '0.3' : '1'} />,
    Mercuryo: <MercuryoSvg opacity={isDisabled ? '0.3' : '1'} isDark={theme.isDark} />,
  }
  const logo = providerToLogo[provider]
  return logo
}
