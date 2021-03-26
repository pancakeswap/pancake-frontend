import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import PrizesText from './PrizesText'
import PrizesTable from './PrizesTable'

const Wrapper = styled(Flex)`
  max-width: 736px;
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`

const PrizesInfo = () => {
  return (
    <Wrapper flexDirection="column">
      <PrizesTable />
      <PrizesText />
    </Wrapper>
  )
}

export default PrizesInfo
