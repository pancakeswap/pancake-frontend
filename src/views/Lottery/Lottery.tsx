import React, { useState, useEffect } from 'react'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { getLotteryIssueIndex } from 'utils/lotteryUtils'
import { useLottery } from 'hooks/useContract'
import Page from 'components/Layout/Page'
import Hero from './components/Hero'
import PastDrawsPage from './PastDrawsPage'

const Lottery: React.FC = () => {
  const lotteryContract = useLottery()
  const [historyData, setHistoryData] = useState([])
  const [historyError, setHistoryError] = useState(false)
  const [currentLotteryNumber, setCurrentLotteryNumber] = useState(0)
  const [mostRecentLotteryNumber, setMostRecentLotteryNumber] = useState(1)

  useEffect(() => {
    fetch(`https://api.pancakeswap.com/api/lotteryHistory`)
      .then((response) => response.json())
      .then((data) => setHistoryData(data))
      .catch(() => {
        setHistoryError(true)
      })
  }, [])

  useEffect(() => {
    const getInitialLotteryIndex = async () => {
      const index = await getLotteryIssueIndex(lotteryContract)
      const previousLotteryNumber = index - 1

      setCurrentLotteryNumber(index)
      setMostRecentLotteryNumber(previousLotteryNumber)
    }

    if (lotteryContract) {
      getInitialLotteryIndex()
    }
  }, [lotteryContract])

  return (
    <>
      <Hero />
      <Page>
        <PastLotteryDataContext.Provider
          value={{ historyError, historyData, mostRecentLotteryNumber, currentLotteryNumber }}
        >
          <PastDrawsPage />
        </PastLotteryDataContext.Provider>
      </Page>
    </>
  )
}

export default Lottery
