import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { TopIntersect, BottomIntersect } from './StyledIntersect'

const Wrapper = styled(Flex)`
  padding-top: 32px;
  position: relative;
  flex-direction: column;
`

const Background = styled.div`
  z-index: -1;
  padding-top: 32px;
  background-color: ${({ theme }) => theme.colors.text};
  height: 100%;
  position: absolute;
  left: -24px;
  bottom: 0;
  width: calc(100% + 48px);
`

const IntersectWrapper = styled.div`
  z-index: -1;
  position: absolute;
  left: -24px;
  bottom: -50%;
  transform: translate(0%, 50%);
  width: calc(100% + 48px);
`

const Section = ({ children }) => {
  return (
    <>
      <Wrapper>
        {children}
        <Background />
        <IntersectWrapper>
          <BottomIntersect width="100%" />
        </IntersectWrapper>
      </Wrapper>
    </>
  )
}

export default Section
