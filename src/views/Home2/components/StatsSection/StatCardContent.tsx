import React from 'react'
import { Heading, Flex, Text } from '@pancakeswap/uikit'

const StatCardContent: React.FC<{ headingText: string; bodyText: string; highlightColor: string }> = ({
  headingText,
  bodyText,
  highlightColor,
}) => {
  const split = headingText.split(' ')
  const lastWord = split.pop()
  const remainingWords = split.slice(0, split.length).join(' ')

  return (
    <Flex
      minHeight={[null, null, null, '168px']}
      minWidth="232px"
      width="fit-content"
      flexDirection="column"
      justifyContent="flex-end"
      mt={[null, null, null, '64px']}
    >
      <Heading scale="xl">{remainingWords}</Heading>
      <Heading color={highlightColor} scale="xl" mb="24px">
        {lastWord}
      </Heading>
      <Text color="textSubtle">{bodyText}</Text>
    </Flex>
  )
}

export default StatCardContent
