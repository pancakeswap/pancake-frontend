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
        marginRight: '0px',
        marginLeft: '0px',
        paddingRight: '0px',
        paddingLeft: '0px',
      }
    }
    return {}
  }
  const replaceDigitsWithWider = () => {
    const valueString = value.toLocaleString(undefined, { maximumFractionDigits: decimals })
    return valueString.replaceAll('1', '9')
  }

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <Text style={containerStyles()} color={isDisabled ? 'textDisabled' : color} onClick={onClick} {...props}>
      {fixedWidth && (
        <Text style={{ visibility: 'hidden', height: '0px' }} {...props}>
          {prefix && <span>{prefix}</span>}
          {replaceDigitsWithWider()}
          {unit && <span>{unit}</span>}
        </Text>
      )}
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

export default Balance
