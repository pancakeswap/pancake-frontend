import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { TopIntersect, BottomIntersect } from './StyledIntersect'

const Wrapper = styled(Flex)`
  padding-top: 32px;
  position: relative;
  flex-direction: column;
`

const IntersectWrapper = styled.div`
  z-index: -1;
  position: absolute;
  left: -32px;
  bottom: -50%;
  transform: translate(0%, 50%);
  width: calc(100% + 32px);
`

const IntersectSpacer = styled.div``

const Section = ({ children }) => {
  return (
    <>
      <Wrapper>
        {children}
        <IntersectSpacer />
        <IntersectWrapper>
          <BottomIntersect width="100%" />
        </IntersectWrapper>
      </Wrapper>
    </>
  )
}

export default Section
