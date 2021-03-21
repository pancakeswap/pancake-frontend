import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { TopIntersect, BottomIntersect } from './StyledIntersect'

const Wrapper = styled(Flex)`
  padding-top: 32px;
  position: relative;
  margin: -24px;
  background-color: ${({ theme }) => theme.colors.text};
  flex-direction: column;
`

const IntersectWrapper = styled.div`
  z-index: -1;
  margin: 23px -24px 0;
  width: calc(100% + 48px);
`

const Section = ({ children }) => {
  return (
    <>
      <Wrapper>{children}</Wrapper>
      <IntersectWrapper>
        <BottomIntersect width="100%" />
      </IntersectWrapper>
    </>
  )
}

export default Section
