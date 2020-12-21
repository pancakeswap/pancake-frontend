import React, { useState, useEffect } from 'react'
import { Switch } from 'react-router-dom'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import Divider from './components/Divider'
import LotteryPageToggle from './components/LotteryPageToggle'
import NextDrawPage from './NextDrawPage'
import PastDrawsPage from './PastDrawsPage'

const Lottery: React.FC = () => {
  const [nextDrawActive, setNextDrawActive] = useState(true)
  const [historyData, setHistoryData] = useState([])
  const [historyError, setHistoryError] = useState(false)

  const getHistoryChartData = () => {
    fetch(`https://api.pancakeswap.com/api/lotteryHistory`)
      .then((response) => response.json())
      .then((data) => setHistoryData(data))
      .catch(() => {
        setHistoryError(true)
      })
  }

  useEffect(() => {
    getHistoryChartData()
  }, [])

  return (
    <Switch>
      <Page>
        <Hero />
        <Container>
          <LotteryPageToggle nextDrawActive={nextDrawActive} setNextDrawActive={setNextDrawActive} />
          <Divider />
          {nextDrawActive ? <NextDrawPage /> : <PastDrawsPage historyError={historyError} historyData={historyData} />}
        </Container>
      </Page>
    </Switch>
  )
}

export default Lottery
