import { Flex } from '@pancakeswap/uikit'
import React from 'react'
import {
  EasterTradingHistoricalBanner,
  FanTokenHistoricalBanner,
  MoboxHistoricalBanner,
} from './components/HistoricalBanner'
import SubMenu from './components/SubMenu'

const FinishedCompetitions: React.FC = () => {
  return (
    <>
      <SubMenu />
      <Flex flexDirection="column" justifyContent="center" alignItems="center" mb="24px" mt="24px">
        <MoboxHistoricalBanner />
        <FanTokenHistoricalBanner />
        <EasterTradingHistoricalBanner />
      </Flex>
    </>
  )
}

export default FinishedCompetitions
