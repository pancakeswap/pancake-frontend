import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'

import styled from 'styled-components'

interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
}

const StyledCardValue = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = '40px',
}) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return <StyledCardValue style={{ fontSize }}>{countUp}</StyledCardValue>
}

export default CardValue
