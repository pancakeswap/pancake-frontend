/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'

import styled from 'styled-components'

interface BalanceProps {
  value: string | number
  decimals?: number
  fontSize?: string | number
}

const Balance: React.FC<BalanceProps> = ({
  value,
  decimals,
  fontSize = '30px',
}) => {
  const [start, updateStart] = useState(0)
  const [end, updateEnd] = useState(0)

  useEffect(() => {
    if (typeof value === 'number') {
      updateStart(end)
      updateEnd(value)
    }
  }, [value])

  return (
    <StyledBalance style={{ fontSize: fontSize }}>
      {typeof value == 'string' ? (
        value
      ) : (
        <CountUp
          start={start}
          end={end}
          decimals={
            decimals !== undefined ? decimals : end < 0 ? 4 : end > 1e5 ? 0 : 3
          }
          duration={1}
          separator=","
        />
      )}
    </StyledBalance>
  )
}

const StyledBalance = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 40px;
  font-weight: 600;
`

export default Balance
