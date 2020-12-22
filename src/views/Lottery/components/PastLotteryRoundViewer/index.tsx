import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Card, CardBody } from '@pancakeswap-libs/uikit'
import useSushi from 'hooks/useSushi'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import { getLotteryContract, getLotteryIssueIndex } from 'sushi/lotteryUtils'
import Loading from 'components/Loading/Loading'
import PastLotterySearcher from './PastLotterySearcher'
import PastRoundCard from './PastRoundCard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const PastLotteryRoundViewer = () => {
  const sushi = useSushi()
  const TranslateString = useI18n()
  const lotteryContract = getLotteryContract(sushi)
  const { account } = useWallet()
  const [inputNumber, setInputNumber] = useState(1)
  const [mostRecentLotteryNumber, setMostRecentLotteryNumber] = useState(1)
  const [roundData, setRoundData] = useState(null)
  const [error, setError] = useState({ message: null, type: null })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const getInitialLotteryIndex = async () => {
      const index = await getLotteryIssueIndex(lotteryContract)
      const previousLotteryNumber = index - 1
      setInputNumber(previousLotteryNumber)
      setMostRecentLotteryNumber(previousLotteryNumber)
      setLoaded(true)
    }

    if (account && lotteryContract && sushi) {
      getInitialLotteryIndex()
    }
  }, [account, lotteryContract, sushi])

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
          <CardBody>
            <Loading />
          </CardBody>
        </Card>
      ) : (
        <PastRoundCard error={error} data={roundData} />
      )}
    </Wrapper>
  )
}

export default PastLotteryRoundViewer
