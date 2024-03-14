import { Colors, Heading, TextProps } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useMemo } from 'react'

interface HeadingProps extends TextProps {
  text: string
  firstColor?: keyof Colors
}

const ColoredWordHeading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  text,
  firstColor,
  mb = '24px',
  ...props
}) => {
  const { theme } = useTheme()
  const { firstWord, remainingWords } = useMemo(() => {
    const split = text.split(' ')
    const first = split[0]
    const remaining = split.slice(1).join(' ')
    return { firstWord: first, remainingWords: remaining }
  }, [text])
  const displayedColor = theme.colors[firstColor ?? 'secondary'] ?? theme.colors.secondary

  return (
    <Heading scale="xl" mb={mb} {...props}>
      <span style={{ color: displayedColor }}>{firstWord} </span>
      {remainingWords}
    </Heading>
  )
}

export default ColoredWordHeading
