import styled from 'styled-components'

import Image from 'next/image'
import USDIcon from '../../../../../public/fiatCurrencies/usd.svg'
import EuroIcon from '../../../../../public/fiatCurrencies/euro.svg'
import GBPIcon from '../../../../../public/fiatCurrencies/gbp.svg'

export const Icons: { [img: string]: JSX.Element } = {
  EUR: <Image src={EuroIcon} alt="#" />,
  USD: <Image src={USDIcon} alt="#" />,
  GBP: <Image src={GBPIcon} alt="#" />,
}
const UnknownEntry = styled.div`
  height: 24px;
  width: 24px;
  background: #dee0e3;
  border-radius: 50%;
`

export const FiatIcon = ({ name }: { name: string }) => {
  const Icon = Icons[name] as JSX.Element
  return <>{Icon !== undefined ? Icon : <UnknownEntry />}</>
}
