import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, useMatchBreakpoints } from '@pancakeswap-libs/uikit'

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 0px;
  }
`

const Details: React.FunctionComponent = () => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Container>
      {!isMobile && Details}
      <ChevronDownIcon color="primary" />
    </Container>
  )
}

export default Details
