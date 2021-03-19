import React from 'react'
import { Svg, SvgProps } from '@pancakeswap-libs/uikit'

const Prizes: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 412 121" {...props}>
      <g filter="url(#filter0_d)">
        <path d="M412 41.5895C360.683 25.8494 287.382 16 206 16C124.618 16 51.3166 25.8494 0 41.5895V121H412V41.5895Z" />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="-12"
          y="0"
          width="436"
          height="129"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dy="-4" />
          <feGaussianBlur stdDeviation="6" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </Svg>
  )
}

export default Prizes
