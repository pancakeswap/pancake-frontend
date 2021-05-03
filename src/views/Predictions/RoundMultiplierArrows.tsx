import React from 'react'
import { useTheme } from 'styled-components'
import { Svg, SvgProps } from '@pancakeswap-libs/uikit'

interface MultiplierProps extends SvgProps {
  isActive: boolean
}

export const RoundMultiplierDownArrow: React.FC<MultiplierProps> = ({ isActive, ...props }) => {
  const theme = useTheme()
  const fill = theme.colors[isActive ? 'failure' : 'tertiary']

  return (
    <Svg height="65px" width="240px" viewBox="0 0 240 65" {...props}>
      <g filter="url(#filter0_i)">
        <path
          d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
          fill={fill}
        />
      </g>
      <defs>
        <filter
          id="filter0_i"
          x="10.0001"
          y="1"
          width="224"
          height="62.9688"
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

export const RoundMultiplierUpArrow: React.FC<MultiplierProps> = ({ isActive, ...props }) => {
  const theme = useTheme()
  const fill = theme.colors[isActive ? 'success' : 'tertiary']

  return (
    <Svg height="65px" width="240px" viewBox="0 0 240 65" {...props}>
      <g filter="url(#filter0_i)">
        <path
          d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
          fill={fill}
        />
      </g>
      <defs>
        <filter
          id="filter0_i"
          x="10.0001"
          y="1.03125"
          width="224"
          height="62.9688"
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
