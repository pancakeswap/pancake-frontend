import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import Tooltip from 'views/Farms/components/Tooltip/Tooltip'

interface TextProps {
  isDisabled?: boolean
  fontSize?: string
  color?: string
  bold?: boolean
}

interface Props extends TextProps {
  decimalPlaces: number
  value: number | string
}

const StyledText = styled(Text)<TextProps>`
  color: ${({ isDisabled, color, theme }) => (isDisabled ? theme.colors.textDisabled : theme.colors[color])};
`

export const truncateToDecimals = (value, decimalPlaces): string => {
  const decimals = 10 ** decimalPlaces
  const truncatedValue = Math.floor(Number(value) * decimals) / decimals
  const hasTruncatedDecimals = truncatedValue !== Number(value)
  if (hasTruncatedDecimals) {
    return `${truncatedValue.toFixed(decimalPlaces)}${hasTruncatedDecimals ? '(...)' : ''}`
  }

  return truncatedValue.toString()
}

const Decimals: React.FC<Props> = ({
  decimalPlaces,
  color = 'text',
  value,
  fontSize = '16px',
  isDisabled = false,
  bold = false,
  ...props
}) => {
  const truncatedValue = truncateToDecimals(value, decimalPlaces)
  const isTruncated = truncatedValue !== String(value)

  if (isTruncated) {
    return (
      <Tooltip content={Number(value)}>
        <StyledText
          color={color}
          fontSize={fontSize}
          isDisabled={isDisabled}
          bold={bold}
          {...props}
          style={{ cursor: 'pointer' }}
        >
          {truncatedValue}
        </StyledText>
      </Tooltip>
    )
  }

  return (
    <StyledText color={color} fontSize={fontSize} isDisabled={isDisabled} bold={bold} {...props}>
      {truncatedValue}
    </StyledText>
  )
}

export default Decimals
