import React from 'react'
import SubMenu from './components/SubMenu'
import MoDCompetition from './MoDCompetition'

const TradingCompetitionPage: React.FC<{ children: React.ReactNode }> = () => {
  return (
    <>
      <SubMenu />
      <MoDCompetition />
    </>
  )
}

export default TradingCompetitionPage
