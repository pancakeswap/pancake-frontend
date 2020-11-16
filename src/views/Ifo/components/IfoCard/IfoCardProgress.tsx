import React from 'react'
import styled from 'styled-components'
import { Heading, Progress } from '@pancakeswap-libs/uikit'

const StyledIfoCardProgress = styled.div``

const StyledProgress = styled.div`
  margin-bottom: 16px;
`

const Details = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`

const Countdown = styled(Heading).attrs({ as: 'h4' })`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`

const Label = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  margin-left: 8px;
`

const IfoCardProgress = () => {
  return (
    <StyledIfoCardProgress>
      <StyledProgress>
        <Progress step={10} />
      </StyledProgress>
      <Details>
        <Countdown>1d 30h 20m until sale</Countdown>
        <Label>(block)</Label>
      </Details>
    </StyledIfoCardProgress>
  )
}

export default IfoCardProgress
