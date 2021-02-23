import React from 'react'
import styled from 'styled-components'
import { HelpIcon } from '@pancakeswap-libs/uikit'

import Tooltip from '../Tooltip/Tooltip'

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  font-weight: 600;
  text-align: right;

  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: left;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultipler = multiplier ? multiplier.toLowerCase() : '-'

  return (
    <Container>
      <MultiplierWrapper>{displayMultipler}</MultiplierWrapper>
      <Tooltip
        content={
          <div>
            The multiplier represents the amount of CAKE rewards each farm gets.
            <br />
            <br />
            For example, if a 1x farm was getting 1 CAKE per block, a 40x farm would be getting 40 CAKE per block.
          </div>
        }
      >
        <HelpIcon color="textSubtle" />
      </Tooltip>
    </Container>
  )
}

export default Multiplier
