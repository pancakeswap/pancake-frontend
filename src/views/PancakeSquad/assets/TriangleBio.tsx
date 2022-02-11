import { Svg, SvgProps } from '@tovaswapui/uikit'
import * as React from 'react'

const Icon: React.FC<SvgProps & { isDark: boolean }> = ({ isDark, ...props }) => {
  return (
    <Svg viewBox="0 0 21 47" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.416 24.914L17.66 41.157a8 8 0 012.343 5.657V.186a8 8 0 01-2.343 5.657L1.416 22.086a2 2 0 000 2.828z"
        fill={isDark ? '#000' : '#fff'}
      />
    </Svg>
  )
}

export default Icon
