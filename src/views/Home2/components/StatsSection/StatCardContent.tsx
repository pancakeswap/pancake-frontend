import React from 'react'
import { Heading, Flex, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

const StatCardContent: React.FC<{ headingText: string; bodyText: string }> = ({ headingText, bodyText }) => {
  const { theme } = useTheme()
  const split = headingText.split(' ')
  const lastWord = split.pop()
  const remainingWords = split.slice(0, split.length).join(' ')

  return (
    <Flex minHeight="180px" flexDirection="column" justifyContent="flex-end" mt="64px">
      <Heading scale="xl">{remainingWords}</Heading>
      <Heading color="secondary" scale="xl" mb="24px">
        {lastWord}
      </Heading>
      <Text color="textSubtle">{bodyText}</Text>
    </Flex>
  )
}

export default StatCardContent
