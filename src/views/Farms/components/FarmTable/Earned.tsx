import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

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
  const { account } = useWeb3React()
  const displayBalance = earnings !== null && account ? earnings.toLocaleString() : '?'

  return <Amount earned={earnings}>{displayBalance}</Amount>
}

export default Earned
