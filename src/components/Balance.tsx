import { Text, TextProps, Skeleton } from '@pancakeswap/uikit'
import { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import styled, { keyframes } from 'styled-components'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'

interface BalanceProps extends TextProps {
  value: number
  decimals?: number
  unit?: string
  isDisabled?: boolean
  prefix?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const Balance: React.FC<BalanceProps> = ({
  value,
  color = 'text',
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  ...props
}) => {
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <Text color={isDisabled ? 'textDisabled' : color} onClick={onClick} {...props}>
      <CountUp
        start={previousValue.current}
        end={value}
        prefix={prefix}
        suffix={unit}
        decimals={decimals}
        duration={1}
        separator=","
      />
    </Text>
  )
}

export const BalanceWithLoading: React.FC<BalanceProps> = ({ value, fontSize, ...props }) =>
  isUndefinedOrNull(value) ? <Skeleton /> : <Balance {...props} value={Number(value)} fontSize={fontSize} />

const appear = keyframes`
  from {
    opacity:0;
  }
  
  to {
    opacity:1;
  }
  `

export const AnimatedBalance = styled(Balance)`
  animation: ${appear} 0.65s ease-in-out forwards;
`

export default Balance
