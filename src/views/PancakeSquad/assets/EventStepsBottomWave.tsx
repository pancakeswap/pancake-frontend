import * as React from 'react'
import { Svg, SvgProps } from '@pancakeswap/uikit'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg preserveAspectRatio="none" viewBox="0 0 1280 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 16.002V0.00195312C159.43 9.20767 387.163 14.9682 640 14.9682C892.837 14.9682 1120.57 9.20767 1280 0.00195312V16.002H0Z"
        fill="url(#paint0_linear)"
      />
      <defs>
        <linearGradient id="paint0_linear" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FAF9FA" />
          <stop offset="1" stopColor="#d7caec" />
        </linearGradient>
      </defs>
    </Svg>
  )
}

export default Icon
