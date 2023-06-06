import React from 'react'
import styled from 'styled-components'

import USDIcon from '../../../../../public/fiatCurrencies/usd.svg'
import EuroIcon from '../../../../../public/fiatCurrencies/euro.svg'
import GBPIcon from '../../../../../public/fiatCurrencies/gbp.svg'

export const Icons: {
  [key: string]: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >
} = {
  EUR: EuroIcon,
  USD: USDIcon,
  GBP: GBPIcon,
}

interface Props {
  name: string
  white?: boolean
}

const UnknownEntry = styled.div`
  height: 24px;
  width: 24px;
  background: #dee0e3;
  border-radius: 50%;
`

export const FiatIcon: React.FC<
  Props &
    (React.SVGProps<SVGSVGElement> &
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ name, className, ...props }) => {
  const Icon = Icons[name]
  return <>{Icon ? <Icon className={className} {...props} /> : <UnknownEntry />}</>
}
