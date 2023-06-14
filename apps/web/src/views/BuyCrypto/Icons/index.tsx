import { BinanceConnectIcon, MercuryoSvg, MoonPaySvg } from './Icons'

export const ProviderToLogo: { [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
  MoonPay: MoonPaySvg,
  Mercuryo: MercuryoSvg,
  BinanceConnect: BinanceConnectIcon,
}
export const ProviderIcon: React.FC<
  { provider: string; isDisabled: boolean } & (React.SVGProps<SVGSVGElement> &
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ provider, isDisabled }: any) => {
  const Logo = ProviderToLogo[provider]
  return <Logo opacity={isDisabled ? '0.3' : '1'} />
}
