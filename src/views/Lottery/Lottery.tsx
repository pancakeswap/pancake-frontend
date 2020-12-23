import React, { useState, useEffect } from 'react'
import { Switch } from 'react-router-dom'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import useSushi from 'hooks/useSushi'
import { useWallet } from 'use-wallet'
import { getLotteryContract, getLotteryIssueIndex } from 'sushi/lotteryUtils'
import Hero from './components/Hero'
import Divider from './components/Divider'
import LotteryPageToggle from './components/LotteryPageToggle'
import NextDrawPage from './NextDrawPage'
import PastDrawsPage from './PastDrawsPage'

const Lottery: React.FC = () => {
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const { account } = useWallet()

  const [nextDrawActive, setNextDrawActive] = useState(true)
  const [historyData, setHistoryData] = useState([])
  const [historyError, setHistoryError] = useState(false)
  const [mostRecentLotteryNumber, setMostRecentLotteryNumber] = useState(1)

  useEffect(() => {
    const getHistoryChartData = () => {
      fetch(`https://api.pancakeswap.com/api/lotteryHistory`)
        .then((response) => response.json())
        .then((data) => setHistoryData(data))
        .catch(() => {
          setHistoryError(true)
        })
    }
    getHistoryChartData()
  }, [])

  useEffect(() => {
    const getInitialLotteryIndex = async () => {
      const index = await getLotteryIssueIndex(lotteryContract)
      const previousLotteryNumber = index - 1
      setMostRecentLotteryNumber(previousLotteryNumber)
    }

    if (account && lotteryContract && sushi) {
      getInitialLotteryIndex()
    }
  }, [account, lotteryContract, sushi])

  return (
    <Switch>
      <Page>
        <Hero />
        <Container>
          <LotteryPageToggle nextDrawActive={nextDrawActive} setNextDrawActive={setNextDrawActive} />
          <Divider />
          <PastLotteryDataContext.Provider value={{ historyError, historyData, mostRecentLotteryNumber }}>
            {nextDrawActive ? <NextDrawPage /> : <PastDrawsPage />}
          </PastLotteryDataContext.Provider>
        </Container>
      </Page>
    </Switch>
  )
}

export default Lottery
