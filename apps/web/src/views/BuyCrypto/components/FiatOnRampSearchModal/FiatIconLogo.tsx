import styled from 'styled-components'

import Image from 'next/image'
import USDIcon from '../../../../../public/USD.svg'
import EuroIcon from '../../../../../public/EUR.svg'
import GBPIcon from '../../../../../public/GBP.svg'
import AUDIcon from '../../../../../public/AUD.svg'
import BRLIcon from '../../../../../public/BRL.svg'
import CADIcon from '../../../../../public/CAD.svg'
import HKDIcon from '../../../../../public/HKD.svg'
import IDRIcon from '../../../../../public/IDR.svg'
import JPYIcon from '../../../../../public/JPY.svg'
import KRWIcon from '../../../../../public/KRW.svg'
import SGDIcon from '../../../../../public/SGD.svg'
import TWDIcon from '../../../../../public/TWD.svg'

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
