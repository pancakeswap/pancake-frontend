import React from 'react'
import Page from 'components/layout/Page'
import YourScore from './components/YourScore'

const TradingCompetition = () => {
  const registered = false

  return (
    <Page>
      <YourScore registered={registered} />
    </Page>
  )
}

export default TradingCompetition
