import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
import styled from 'styled-components'
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
  const { mostRecentLotteryNumber } = useContext(PastLotteryDataContext)
  const [state, setState] = useState({
    roundData: null,
    error: { message: null, type: null },
    isInitialized: false,
    isLoading: true,
  })
  const { roundData, error, isInitialized, isLoading } = state

  const TranslateStringRef = useRef(TranslateString)

  const getLotteryRoundData = useCallback(
    (lotteryNumber: number) => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
      }))

      fetch(`https://api.pancakeswap.com/api/singleLottery?lotteryNumber=${lotteryNumber}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setState((prevState) => ({
              ...prevState,
              error: {
                message: TranslateStringRef.current(999, 'The lottery number you provided does not exist'),
                type: 'out of range',
              },
              isLoading: false,
              isInitialized: true,
            }))
          } else {
            setState((prevState) => ({
              ...prevState,
              error: { message: null, type: null },
              roundData: data,
              isLoading: false,
              isInitialized: true,
            }))
          }
        })
        .catch(() => {
          setState((prevState) => ({
            ...prevState,
            error: { message: TranslateStringRef.current(999, 'Error fetching data'), type: 'api' },
            isLoading: false,
            isInitialized: true,
          }))
        })
    },
    [setState, TranslateStringRef],
  )

  useEffect(() => {
    if (mostRecentLotteryNumber > 0) {
      getLotteryRoundData(mostRecentLotteryNumber)
    }
  }, [mostRecentLotteryNumber, getLotteryRoundData])

  const handleSubmit = (lotteryNumber: number) => {
    getLotteryRoundData(lotteryNumber)
  }

  return (
    <Wrapper>
      <PastLotterySearcher initialLotteryNumber={mostRecentLotteryNumber} onSubmit={handleSubmit} />
      {!isInitialized || isLoading ? (
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
