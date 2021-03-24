import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import { Text } from '@pancakeswap-libs/uikit'
import useTheme from '../hooks/useTheme'

interface TextProps {
  isDisabled?: boolean
  fontSize?: string
  color?: string
}

interface BalanceProps extends TextProps {
  value?: number
  decimals?: number
  unit?: string
}

const Balance: React.FC<BalanceProps> = ({ value, fontSize, color, decimals, isDisabled, unit }) => {
  const previousValue = useRef(0)

  const { theme } = useTheme()

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <Text bold color={isDisabled ? theme.colors.textDisabled : color} fontSize={fontSize}>
      <CountUp start={previousValue.current} end={value} decimals={decimals} duration={1} separator="," />
      {value && unit && <span>{unit}</span>}
    </Text>
  )
}

Balance.defaultProps = {
  fontSize: '32px',
  isDisabled: false,
  color: 'text',
  decimals: 3,
}

export default Balance
