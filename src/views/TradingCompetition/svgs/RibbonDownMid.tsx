import React from 'react'
import { Svg, SvgProps } from '@pancakeswap-libs/uikit'

const RibbonDownMid: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 142 48" {...props}>
      <rect width="142" height="46" fill="#7645D9" />
      <rect y="46" width="142" height="2" fill="#3B2070" />
    </Svg>
  )
}

export default RibbonDownMid
