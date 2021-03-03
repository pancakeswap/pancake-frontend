import React from 'react'
import styled from 'styled-components'

export interface EarnedProps {
  earnings: number
  pid: number
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const Earned: React.FunctionComponent<EarnedProps> = ({ earnings }) => {
  const displayBalance = earnings !== null ? earnings.toLocaleString() : '?'

  return <Amount earned={earnings}>{displayBalance}</Amount>
}

export default Earned
