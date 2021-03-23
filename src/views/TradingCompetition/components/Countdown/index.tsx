import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'

const Wrapper = styled.div`
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
  border: 1px solid #7645d9;
  box-sizing: border-box;
  border-radius: 0px 0px 24px 24px;
  padding: 16px 24px;
`

const StyledFlex = styled(Flex)``

const Countdown = () => {
  return (
    <Wrapper>
      <StyledFlex>
        <span>Yo</span>
      </StyledFlex>
    </Wrapper>
  )
}

export default Countdown
