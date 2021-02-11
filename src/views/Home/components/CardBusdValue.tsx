import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from '@pancakeswap-libs/uikit'

interface CardBusdValueProps {
  value: number
  decimals?: number
  fontSize?: string
}

const CardBusdValue: React.FC<CardBusdValueProps> = ({ value, decimals = 2, fontSize = '14px' }) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <Text fontSize={fontSize} color="textSubtle">
      ~${countUp}
    </Text>
  )
}

export default CardBusdValue
