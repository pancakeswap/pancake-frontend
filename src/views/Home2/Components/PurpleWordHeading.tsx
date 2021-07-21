import React from 'react'
import { Heading } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

const PurpleWordHeading: React.FC<{ text: string }> = ({ text }) => {
  const { theme } = useTheme()
  const split = text.split(' ')
  const firstWord = split[0]
  const remainingWords = split.slice(1).join(' ')
  return (
    <Heading scale="xl" mb="24px">
      <span style={{ color: theme.colors.secondary }}>{firstWord} </span>
      {remainingWords}
    </Heading>
  )
}

export default PurpleWordHeading
