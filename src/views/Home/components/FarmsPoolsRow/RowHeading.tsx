import React from 'react'
import { Heading, TextProps } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'

interface HeadingProps extends TextProps {
  text: string
}

const RowHeading: React.FC<HeadingProps> = ({ text, ...props }) => {
  const { theme } = useTheme()
  const split = text.split(' ')
  const lastWord = split.pop()
  const firstWords = split.join(' ')

  return (
    <Heading mb="24px" {...props}>
      {firstWords}
      <span style={{ color: theme.colors.secondary }}> {lastWord}</span>
    </Heading>
  )
}

export default RowHeading
