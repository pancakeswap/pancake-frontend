import React from 'react'
import styled from 'styled-components'

import CellLayout from './CellLayout'


export interface EarnedProps {
  earnings: number
  pid: number
}

const Amount = styled.span<{ earned: number }>`
  color: ${(props) => (props.earned ? props.theme.colors.text : props.theme.colors.textDisabled)};
  display: flex;
  align-items: center;
  font-weight: 600;
`

const Earned: React.FunctionComponent<EarnedProps> = ({ earnings }) => {
  const displayBalance = earnings !== null ? earnings.toLocaleString() : '?'

  return (
    <CellLayout label="Earned">
      <Amount earned={earnings}>{displayBalance}</Amount>
    </CellLayout>
  )
}

export default Earned
