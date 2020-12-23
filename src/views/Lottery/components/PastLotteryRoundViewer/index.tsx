import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Card, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Loading from 'components/Loading/Loading'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import PastLotterySearcher from './PastLotterySearcher'
import PastRoundCard from './PastRoundCard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledCardBody = styled(CardBody)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PastLotteryRoundViewer = () => {
  const TranslateString = useI18n()
  const [inputNumber, setInputNumber] = useState(1)
  const [roundData, setRoundData] = useState(null)
  const [error, setError] = useState({ message: null, type: null })
  const [loaded, setLoaded] = useState(false)
  const { mostRecentLotteryNumber } = useContext(PastLotteryDataContext)

  useEffect(() => {
    if (mostRecentLotteryNumber > 0) {
      setInputNumber(mostRecentLotteryNumber)
      setLoaded(true)
    }
  }, [mostRecentLotteryNumber])

  const getPastLotteryRoundData = ({ useMostRecentLotteryNumber }) => {
    const lotteryNumber = useMostRecentLotteryNumber ? mostRecentLotteryNumber : inputNumber
    axios
      .get(`https://api.pancakeswap.com/api/singleLottery?lotteryNumber=${lotteryNumber}`)
      .then((res) => {
        if (res.data.error) {
          setError({
            message: TranslateString(999, 'The lottery number you provided does not exist'),
            type: 'out of range',
          })
        } else {
          setError({ message: null, type: null })
          setRoundData(res.data)
        }
      })
      .catch(() => {
        setError({ message: TranslateString(999, 'Error fetching data'), type: 'api' })
      })
  }

  useEffect(() => {
    if (loaded) {
      getPastLotteryRoundData({ useMostRecentLotteryNumber: true })
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [loaded])

  const onSubmit = () => {
    getPastLotteryRoundData({ useMostRecentLotteryNumber: false })
  }

  return (
    <Wrapper>
      <PastLotterySearcher inputNumber={inputNumber} setInputNumber={setInputNumber} onSubmit={onSubmit} />
      {(!roundData && error.type !== 'api') || !loaded ? (
        // if there is no round data, and the api call hasn't errored, OR it's still loading - show loader
        <Card>
          <StyledCardBody>
            <Loading />
          </StyledCardBody>
        </Card>
      ) : (
        <PastRoundCard error={error} data={roundData} />
      )}
    </Wrapper>
  )
}

export default PastLotteryRoundViewer
