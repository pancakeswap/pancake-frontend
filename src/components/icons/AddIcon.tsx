import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { IconProps } from '../Icon'

const AddIcon: React.FC<IconProps> = ({ color, size = 24 }) => {
  const { color: themeColor } = useContext(ThemeContext)
  return (
    <svg
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M0 0h24v24H0z"
        fill="none"
      />
      <path
        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
        fill={color ? color : themeColor.grey[400]}
      />
    </svg>
  )
}

export default AddIcon