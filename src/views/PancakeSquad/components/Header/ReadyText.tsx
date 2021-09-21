import { CheckmarkIcon, Flex, Text } from '@pancakeswap/uikit'
import React from 'react'

type ReadyTextProps = {
  text: string
}

const ReadyText: React.FC<ReadyTextProps> = ({ text }) => {
  return (
    <Flex alignItems="center">
      <Text fontSize="16px" color="success" mr="4px" bold>
        {text}
      </Text>
      <CheckmarkIcon color="success" width="17px" />
    </Flex>
  )
}

export default ReadyText
