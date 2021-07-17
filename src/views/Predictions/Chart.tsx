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
interface ChartProps {
  userInfo: any
}

const Chart: React.FC<ChartProps> = ({userInfo}) => {
  return (
    <Flex flexDirection="column" height="100%">
      <MenuWrapper>
        <Menu userInfo={userInfo} />
      </MenuWrapper>
      <ChartWrapper>
        <PrizeTab />
      </ChartWrapper>
    </Flex>
  )
}

export default Chart
