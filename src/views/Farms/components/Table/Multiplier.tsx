import React from 'react'
import styled from 'styled-components'
import { HelpIcon } from '@pancakeswap-libs/uikit'

import CellLayout from './CellLayout'

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 2.5rem;
  font-weight: 600;
  text-align: left;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultipler = multiplier ? multiplier.toLowerCase() : '-'

  return (
    <CellLayout label="Multiplier">
      <MultiplierWrapper>{displayMultipler}</MultiplierWrapper>
      <HelpIcon color="textSubtle" />
    </CellLayout>
  )
}

export default Multiplier;