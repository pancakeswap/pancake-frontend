import React from 'react'
import { Text } from '@pancakeswap/uikit'

export interface EmptyTextProps {
  text: string
}

const EmptyText: React.FC<EmptyTextProps> = ({ text }) => {
  return (
    <tr>
      <td>
        <Text padding="24px" fontSize="16px" textAlign="center">
          {text}
        </Text>
      </td>
    </tr>
  )
}

export default EmptyText
