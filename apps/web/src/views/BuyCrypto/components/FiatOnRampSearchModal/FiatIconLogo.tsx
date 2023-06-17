import styled from 'styled-components'

import Image from 'next/image'
import USDIcon from '../../../../../public/fiatCurrencies/USD.svg'
import EuroIcon from '../../../../../public/fiatCurrencies/EUR.svg'
import GBPIcon from '../../../../../public/fiatCurrencies/GBP.svg'
import AUDIcon from '../../../../../public/fiatCurrencies/AUD.svg'
import BRLIcon from '../../../../../public/fiatCurrencies/BRL.svg'
import CADIcon from '../../../../../public/fiatCurrencies/CAD.svg'
import HKDIcon from '../../../../../public/fiatCurrencies/HKD.svg'
import IDRIcon from '../../../../../public/fiatCurrencies/IDR.svg'
import JPYIcon from '../../../../../public/fiatCurrencies/JPY.svg'
import KRWIcon from '../../../../../public/fiatCurrencies/KRW.svg'
import SGDIcon from '../../../../../public/fiatCurrencies/SGD.svg'
import TWDIcon from '../../../../../public/fiatCurrencies/TWD.svg'

export const Icons: { [img: string]: JSX.Element } = {
  GBP: <Image src={GBPIcon} alt="##" width={20} />,
  USD: <Image src={USDIcon} alt="#" width={20} />,
  EUR: <Image src={EuroIcon} alt="#" width={20} />,
  AUD: <Image src={AUDIcon} alt="#" width={20} />,
  BRL: <Image src={BRLIcon} alt="#" width={20} />,
  CAD: <Image src={CADIcon} alt="#" width={20} />,
  HKD: <Image src={HKDIcon} alt="#" width={20} />,
  IDR: <Image src={IDRIcon} alt="#" width={20} />,
  JPY: <Image src={JPYIcon} alt="#" width={20} />,

  KRW: <Image src={KRWIcon} alt="#" width={20} />,
  SGD: <Image src={SGDIcon} alt="#" width={20} />,
  TWD: <Image src={TWDIcon} alt="#" width={20} />,
  VND: <Image src={GBPIcon} alt="#" width={20} />,
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
