import { Svg, SvgProps } from '@tovaswapui/uikit'
import * as React from 'react'

const Icon: React.FC<SvgProps & { isDark: boolean }> = ({ isDark, ...props }) => {
  return (
    <Svg viewBox="0 0 1280 16" preserveAspectRatio="none" {...props}>
      <path
        d="M0 16V0c159.43 9.206 387.163 14.966 640 14.966S1120.57 9.206 1280 0v16H0z"
        fill="url(#squad_header_bottom_wave)"
      />
      <defs>
        <linearGradient
          id="squad_header_bottom_wave"
          x1={174.5}
          y1={15.999}
          x2={1233.5}
          y2={16}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isDark ? '#313D5C' : '#E5FDFF'} />
          <stop offset={1} stopColor={isDark ? '#3D2A54' : '#F3EFFF'} />
        </linearGradient>
      </defs>
    </Svg>
  )
}

export default Icon
