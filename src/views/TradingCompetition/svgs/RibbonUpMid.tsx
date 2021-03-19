import React from 'react'
import { Svg, SvgProps } from '@pancakeswap-libs/uikit'

const RibbonUpMid: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 142 48" {...props}>
      <rect width="142" height="46" transform="matrix(1 0 0 -1 0 48)" fill="#7645D9" />
      <rect width="142" height="2" transform="matrix(1 0 0 -1 0 2)" fill="#3B2070" />
    </Svg>
  )
}

export default RibbonUpMid
