import * as React from 'react'
import { Svg, SvgProps } from '@tovaswapui/uikit'

const Icon: React.FC<SvgProps & { isDark: boolean }> = ({ isDark, ...props }) => {
  return (
    <Svg viewBox="0 0 1280 17" preserveAspectRatio="none" {...props}>
      <path
        d="M0 16.002v-16c159.43 9.206 387.163 14.966 640 14.966s480.57-5.76 640-14.966v16H0z"
        fill={isDark ? '#08060B' : '#FAF9FA'}
      />
    </Svg>
  )
}

export default Icon
