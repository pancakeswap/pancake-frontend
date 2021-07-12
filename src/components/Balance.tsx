import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import { Text, TextProps } from '@pancakeswap/uikit'

interface BalanceProps extends TextProps {
  value: number
  decimals?: number
  unit?: string
  isDisabled?: boolean
  prefix?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  fixedWidth?: boolean
}

const Balance: React.FC<BalanceProps> = ({
  value,
  color = 'text',
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  fixedWidth,
  ...props
}) => {
  const previousValue = useRef(0)
  const containerStyles = () => {
    if (fixedWidth) {
      return {
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'sans-serif',
      }
    }
    return {}
  }

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
        delay={0}
      >
        {({ countUpRef }) => <span style={containerStyles()} ref={countUpRef} />}
      </CountUp>
    </Text>
  )
}

export default Balance
