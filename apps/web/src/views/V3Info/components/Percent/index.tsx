import { Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Wrapper = styled(Text)<{ fontWeight: number; fontSize: string; negative: boolean }>`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ theme, negative }) => (negative ? theme.colors.failure : theme.colors.success)};
`

export interface LogoProps {
  value: number | undefined
  decimals?: number
  fontSize?: string
  fontWeight?: number
  wrap?: boolean
  simple?: boolean
}

export default function Percent({
  value,
  decimals = 2,
  fontSize = '16px',
  fontWeight = 500,
  wrap = false,
  simple = false,
  ...rest
}: LogoProps) {
  if (value === undefined || value === null) {
    return (
      <Text fontWeight={fontWeight} fontSize={fontSize}>
        -
      </Text>
    )
  }

  const truncated = parseFloat(value.toFixed(decimals))

  if (simple) {
    return (
      <Wrapper {...rest} fontWeight={fontWeight} fontSize={fontSize} negative={false}>
        {Math.abs(value).toFixed(decimals)}%
      </Wrapper>
    )
  }

  return (
    <Wrapper {...rest} fontWeight={fontWeight} fontSize={fontSize} negative={truncated < 0}>
      {wrap && '('}
      {truncated < 0 && '↓'}
      {truncated > 0 && '↑'}
      {Math.abs(value).toFixed(decimals)}%{wrap && ')'}
    </Wrapper>
  )
}
