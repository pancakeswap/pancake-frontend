import { styled } from 'styled-components'
import { SpaceProps } from 'styled-system'
import { PropsWithChildren, ReactNode, memo } from 'react'
import { Box, Text } from '@pancakeswap/uikit'

interface Props extends SpaceProps {
  title: ReactNode
}

const Section = styled(Box)`
  & + & {
    margin-top: 1em;
  }
`

const Title = styled(Text).attrs({
  color: 'textSubtle',
  textTransform: 'uppercase',
  fontSize: '12px',
  bold: true,
})``

export const CardSection = memo(function CardSection({ title, children, ...props }: PropsWithChildren<Props>) {
  return (
    <Section {...props}>
      <Title>{title}</Title>
      <Box mt="0.25em">{children}</Box>
    </Section>
  )
})
