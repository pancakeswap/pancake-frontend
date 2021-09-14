import { Svg, SvgProps } from '@pancakeswap/uikit'
import * as React from 'react'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props}>
      <path d="M0 0h48v1H0z" fill="#063855" fillRule="evenodd" />
    </Svg>
  )
}

export default Icon
