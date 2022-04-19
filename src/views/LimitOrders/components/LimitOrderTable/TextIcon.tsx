import { Flex, Text } from '@pancakeswap/uikit'
import { ReactNode } from 'react'

interface TextIconProps {
  text: string
  bold?: boolean
  icon: ReactNode
}

const TextIcon: React.FC<TextIconProps> = ({ icon, text, bold = false }) => {
  return (
    <Flex alignItems="center">
      <Text color="text" mr="8px" bold={bold} textTransform="uppercase">
        {text}
      </Text>
      {icon}
    </Flex>
  )
}

export default TextIcon
