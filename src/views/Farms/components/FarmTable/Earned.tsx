import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@pancakeswap-libs/uikit'

export interface EarnedProps {
  earnings: number
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const Earned: React.FunctionComponent<EarnedProps> = ({ earnings }) => {
  // If still loading earnings
  if (earnings === null) {
    return (
      <Amount earned={earnings}>
        <Skeleton width={60} />
      </Amount>
    )
  }

  const displayBalance = earnings.toLocaleString()
  return <Amount earned={earnings}>{displayBalance}</Amount>
}

export default Earned
