import * as React from 'react'
import { Svg, SvgProps } from '@pancakeswap/uikit'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1280 17" preserveAspectRatio="none" {...props}>
      <path
        d="M0 16.002v-16c159.43 9.206 387.163 14.966 640 14.966s480.57-5.76 640-14.966v16H0z"
        fill="url(#prefix__paint0_linear)"
      />
      <defs>
        <linearGradient
          id="prefix__paint0_linear"
          x1={174.5}
          y1={15.999}
          x2={1233.5}
          y2={16}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FAF9FA" />
          <stop offset={1} stopColor="#DFD5F0" />
        </linearGradient>
      </defs>
    </Svg>
  )
}

export default Icon
