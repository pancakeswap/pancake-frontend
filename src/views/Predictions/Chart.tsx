import React from 'react'
import styled from 'styled-components'
import { Flex } from '@rug-zombie-libs/uikit'
import Menu from './components/Menu'
import PrizeTab from './components/PrizeTab'

const MenuWrapper = styled.div`
  flex: none;
`

const ChartWrapper = styled.div`
  flex: 1;
  height: 100%;
`

const Chart = () => {
  return (
    <Flex flexDirection="column" height="100%">
      <MenuWrapper>
        <Menu />
      </MenuWrapper>
      <ChartWrapper>
        <PrizeTab />
      </ChartWrapper>
    </Flex>
  )
}

export default Chart
