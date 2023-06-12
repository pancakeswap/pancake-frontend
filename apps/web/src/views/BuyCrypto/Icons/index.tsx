import styled from 'styled-components'
import { BinanceConnectIcon, MercuryoSvg, MoonPaySvg } from './Icons'

const UnknownEntry = styled.div`
  height: 24px;
  width: 24px;
  background: #dee0e3;
  border-radius: 50%;
`

export const ProviderToLogo: { [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
  MoonPay: MoonPaySvg,
  Mercuryo: MercuryoSvg,
  BinanceConnect: BinanceConnectIcon,
}
export const ProviderIcon: React.FC<
  { provider: string } & (React.SVGProps<SVGSVGElement> &
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ provider }) => {
  const Logo = ProviderToLogo[provider]
  return Logo ? <Logo /> : <UnknownEntry />
}
