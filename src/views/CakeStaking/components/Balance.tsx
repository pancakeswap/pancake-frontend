import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'

interface BalanceProps {
  value: number
  isFinished: boolean
}

const Balance: React.FC<BalanceProps> = ({ value, isFinished }) => {
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <StyledBalance isFinished={isFinished}>
      <CountUp start={previousValue.current} end={value} decimals={3} duration={1} separator="," />
    </StyledBalance>
  )
}

const StyledBalance = styled.div<{ isFinished: boolean }>`
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'text']};
  font-size: 30px;
  font-weight: 600;
`

export default Balance
