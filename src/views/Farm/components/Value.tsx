/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'

import styled from 'styled-components'

interface ValueProps {
  value: string | number
  decimals?: number
  fontSize?: string | number
}

const Value: React.FC<ValueProps> = ({ value, decimals, fontSize = '14px' }) => {
  const [start, updateStart] = useState(0)
  const [end, updateEnd] = useState(0)

  useEffect(() => {
    if (typeof value === 'number') {
      updateStart(end)
      updateEnd(value)
    }
  }, [value])

  return (
    <StyledValue style={{ fontSize }}>
      {typeof value === 'string' ? (
        value
      ) : (
        <CountUp
          start={start}
          end={end}
          // eslint-disable-next-line no-nested-ternary
          decimals={decimals !== undefined ? decimals : end < 0 ? 4 : end > 1e5 ? 0 : 3}
          duration={1}
          separator=","
        />
      )}
    </StyledValue>
  )
}

const StyledValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
`

export default Value
