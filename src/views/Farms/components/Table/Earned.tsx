import React from 'react'
import styled from 'styled-components'

import ColumnLabel from './ColumnLabel'


export interface EarnedProps {
  earnings: number
  pid: number
}

const Amount = styled.span<{ earned: number }>`
  color: ${(props) => (props.earned ? props.theme.colors.text : props.theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const Earned: React.FunctionComponent<EarnedProps> = ({ earnings }) => {
  const displayBalance = earnings !== null ? earnings.toLocaleString() : '?'

  return (
    <div>
      <ColumnLabel>Earned</ColumnLabel>
      <Amount earned={earnings}>{displayBalance}</Amount>
    </div>
  )
}

export default Earned
