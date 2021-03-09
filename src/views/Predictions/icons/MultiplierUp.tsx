import React from 'react'
import { useTheme } from 'styled-components'
import { Svg, SvgProps } from '@pancakeswap-libs/uikit'

interface MultiplierUpProps extends SvgProps {
  isActive: boolean
}

const MultiplierUp: React.FC<MultiplierUpProps> = ({ isActive, ...props }) => {
  const theme = useTheme()
  const fill = theme.colors[isActive ? 'success' : 'tertiary']

  return (
    <Svg height="80px" width="240px" viewBox="0 0 240 80" {...props}>
      <g filter="url(#filter0_i)">
        <path
          d="M9.69179e-05 47.2929L0.000366466 80H240L240 47.2927C240 40.2961 235.454 34.111 228.776 32.0224L134.627 2.575C125.103 -0.403848 114.897 -0.403842 105.373 2.575L11.2239 32.0223C4.54616 34.1109 3.9256e-05 40.2962 9.69179e-05 47.2929Z"
          fill={fill}
        />
      </g>
      <defs>
        <filter
          id="filter0_i"
          x="0"
          y="0.34082"
          width="240"
          height="79.6591"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </Svg>
  )
}

export default MultiplierUp
