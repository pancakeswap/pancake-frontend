import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'

interface BalanceProps {
  value: number
  isDisabled?: boolean
  fontSize?: string
}

const StyledText = styled(Text)<{ isDisabled: boolean }>`
  color: ${({ isDisabled, theme }) => (isDisabled ? theme.colors.textDisabled : theme.colors.text)};
`

const Balance: React.FC<BalanceProps> = ({ value, fontSize, isDisabled }) => {
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <StyledText bold fontSize={fontSize} isDisabled={isDisabled}>
      <CountUp start={previousValue.current} end={value} decimals={3} duration={1} separator="," />
    </StyledText>
  )
}

Balance.defaultProps = {
  fontSize: '32px',
  isDisabled: false,
}

export default Balance
