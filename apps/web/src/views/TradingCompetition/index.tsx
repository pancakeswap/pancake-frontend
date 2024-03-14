import React from 'react'
import MoDCompetition from './MoDCompetition'
import SubMenu from './components/SubMenu'

const TradingCompetitionPage: React.FC<React.PropsWithChildren> = () => {
  return (
    <>
      <SubMenu />
      <MoDCompetition />
    </>
  )
}

export default TradingCompetitionPage
