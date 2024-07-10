import { Svg, SvgProps } from '@pancakeswap/uikit'
import React from 'react'

export const CheckedIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 48 48" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48 0H0L48 48V0ZM26.0183 18.1194L29.7553 21.9718C30.1613 22.3903 30.8274 22.3903 31.223 21.9718L39.1237 13.827C39.5296 13.4085 39.5296 12.7324 39.1237 12.3139C38.7177 11.8954 38.0619 11.8954 37.656 12.3139L30.4944 19.6968L27.4861 16.6063C27.0801 16.1878 26.4243 16.1878 26.0183 16.6063C25.6124 17.0248 25.6124 17.7009 26.0183 18.1194Z"
      />
    </Svg>
  )
}
