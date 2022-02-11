import React from 'react'
import styled from 'styled-components'
import { Flex } from '@tovaswapui/uikit'
import Menu from './components/Menu'
import TradingView from './components/TradingView'

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
        <TradingView />
      </ChartWrapper>
    </Flex>
  )
}

export default Chart
