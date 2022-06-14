import { Text, TextProps, Skeleton } from '@pancakeswap/uikit'
import { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import styled, { keyframes } from 'styled-components'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import _toNumber from 'lodash/toNumber'
import _isNaN from 'lodash/isNaN'
import _replace from 'lodash/replace'
import _toString from 'lodash/toString'

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

export const BalanceWithLoading: React.FC<Omit<BalanceProps, 'value'> & { value: string | number }> = ({
  value,
  fontSize,
  ...props
}) => {
  if (isUndefinedOrNull(value)) {
    return <Skeleton />
  }

  const trimmedValue = _replace(_toString(value), /,/g, '')

  const finalValue = _isNaN(trimmedValue) || _isNaN(_toNumber(trimmedValue)) ? 0 : _toNumber(trimmedValue)

  return <Balance {...props} value={finalValue} fontSize={fontSize} />
}

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
