import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'

interface TextProps {
  isDisabled?: boolean
  fontSize?: string
  color?: string
  prefix?: string
}

interface BalanceProps extends TextProps {
  value?: number
  decimals?: number
  unit?: string
  bold?: boolean
}

const StyledText = styled(Text)<TextProps>`
  color: ${({ isDisabled, color, theme }) => (isDisabled ? theme.colors.textDisabled : color)};
`

const Balance: React.FC<BalanceProps> = ({
  value,
  fontSize,
  color,
  decimals,
  isDisabled,
  unit,
  bold,
  prefix,
  ...props
}) => {
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <StyledText bold={bold} color={color} fontSize={fontSize} isDisabled={isDisabled} {...props}>
      {!!prefix && <span>{prefix}</span>}
      <CountUp start={previousValue.current} end={value} decimals={decimals} duration={1} separator="," />
      {!!(value && unit) && <span>{unit}</span>}
    </StyledText>
  )
}

Balance.defaultProps = {
  fontSize: '32px',
  isDisabled: false,
  color: 'text',
  decimals: 3,
  bold: true,
}

export default Balance
