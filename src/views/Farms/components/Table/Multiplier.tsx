import React from 'react'
import styled from 'styled-components'

import ColumnLabel from './ColumnLabel'

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 1rem;
  color: ${({ theme }) => theme.card.background};
  padding: 0.3125rem 0rem;
  width: 2.5rem;
  text-align: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  return (
    <div>
      <ColumnLabel>
        Multiplier
      </ColumnLabel>
      <MultiplierWrapper>{multiplier}</MultiplierWrapper>
    </div>
  )
}

export default Multiplier;