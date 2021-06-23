import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import { Text, TextProps } from '@pancakeswap/uikit'

interface BalanceWithFiatProps extends TextProps {
  cakeValue: number
  fiatValue: number
  fiatDecimals?: number
  currencySymbol?: string
  isDisabled?: boolean
  prefix?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const BalanceWithFiat: React.FC<BalanceWithFiatProps> = ({
  cakeValue,
  fiatValue,
  color = 'text',
  fiatDecimals = 2,
  isDisabled = false,
  currencySymbol,
  prefix,
  onClick,
  ...props
}) => {
  const previousCakeValue = useRef(0)
  const previousFiatValue = useRef(0)

  useEffect(() => {
    previousCakeValue.current = cakeValue
    previousFiatValue.current = fiatValue
  }, [cakeValue, fiatValue])

  return (
    <Text color={isDisabled ? 'textDisabled' : color} onClick={onClick} {...props}>
      {prefix && <span>{prefix}</span>}
      <CountUp start={previousCakeValue.current} end={cakeValue} decimals={3} duration={1} />
      <span> CAKE (~</span>
      {currencySymbol && <span>{currencySymbol}</span>}
      <CountUp start={previousFiatValue.current} end={fiatValue} decimals={fiatDecimals} duration={1} />
      <span>)</span>
    </Text>
  )
}

export default BalanceWithFiat
