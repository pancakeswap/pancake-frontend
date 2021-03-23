import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { PocketWatch } from '../../svgs'

const Wrapper = styled.div`
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
  border: 1px solid #7645d9;
  box-sizing: border-box;
  border-radius: 0px 0px 24px 24px;
  padding: 16px 24px;
  margin-top: -30px;
  margin-bottom: 50px;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    margin-top: -38px;
    margin-bottom: 0;
    margin-left: 36px;
  }
`

const PocketWatchWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  svg {
    height: 64px;
    width: 64px;
  }
`

const Countdown = () => {
  return (
    <Wrapper>
      <PocketWatchWrapper>
        <PocketWatch />
      </PocketWatchWrapper>
      <Flex flexDirection="column">
        <span>Countdown</span>
        <span>Stepper</span>
      </Flex>
    </Wrapper>
  )
}

export default Countdown
