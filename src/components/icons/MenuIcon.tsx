import React from 'react'

import { IconProps } from '../Icon'

const MenuIcon: React.FC<IconProps> = ({ size = 24 }) => {
  return (
    <svg
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  )
}

export default MenuIcon
