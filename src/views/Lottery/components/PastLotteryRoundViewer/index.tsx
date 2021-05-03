import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Card, CardBody } from '@pancakeswap-libs/uikit'
import getLotteryRoundData from 'utils/getLotteryRoundData'
import { useTranslation } from 'contexts/Localization'
import useGetRecentLotteryRoundData from 'hooks/useGetRecentLotteryRoundData'
import PastLotterySearcher from './PastLotterySearcher'
import PastRoundCard from './PastRoundCard'
import Loading from '../Loading'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledCardBody = styled(CardBody)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 552px; // height of final card
`

const PastLotteryRoundViewer = () => {
  const [state, setState] = useState({
    roundData: null,
    error: { message: null, type: null },
    isInitialized: false,
    isLoading: true,
  })
  const { data: initialLotteryData, mostRecentLotteryNumber } = useGetRecentLotteryRoundData()
  const { t } = useTranslation()
  const { roundData, error, isInitialized, isLoading } = state

  useEffect(() => {
    if (initialLotteryData) {
      setState((prevState) => ({ ...prevState, isLoading: false, isInitialized: true, roundData: initialLotteryData }))
    }
  }, [initialLotteryData, setState])

  const handleSubmit = async (lotteryNumber: number) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }))

    getLotteryRoundData(lotteryNumber)
      .then((data) => {
        if (data.error) {
          setState((prevState) => ({
            ...prevState,
            error: {
              message: t('The lottery number you provided does not exist'),
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
          error: { message: t('Error fetching data'), type: 'api' },
          isLoading: false,
          isInitialized: true,
        }))
      })
  }

  return (
    <Wrapper>
      <PastLotterySearcher initialLotteryNumber={mostRecentLotteryNumber} onSubmit={handleSubmit} />
      {!isInitialized || isLoading ? (
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
