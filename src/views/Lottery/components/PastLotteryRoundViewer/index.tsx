import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Card, CardBody } from '@pancakeswap-libs/uikit'
import useSushi from 'hooks/useSushi'
import { useWallet } from 'use-wallet'
import { getLotteryContract, getLotteryIssueIndex } from '../../../../sushi/lotteryUtils'
import PastLotterySearcher from './PastLotterySearcher'
import PastRoundCard from './PastRoundCard'
import Loading from '../../../../components/Loading/Loading'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const PastLotteryRoundViewer = () => {
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const { account } = useWallet()
  const [inputNumber, setInputNumber] = useState(1)
  const [mostRecentLotteryNumber, setMostRecentLotteryNumber] = useState(1)
  const [roundData, setRoundData] = useState(null)
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const getInitialLotteryIndex = useCallback(async () => {
    const index = await getLotteryIssueIndex(lotteryContract)
    // for some reason the index returned here is out of range by 1
    setInputNumber(index - 1)
    setMostRecentLotteryNumber(index - 1)
    setLoaded(true)
  }, [lotteryContract])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      getInitialLotteryIndex()
    }
  }, [account, lotteryContract, sushi, getInitialLotteryIndex])

  const getPastLotteryRoundData = ({ useMostRecentLotteryNumber }) => {
    const lotteryNumber = useMostRecentLotteryNumber ? mostRecentLotteryNumber : inputNumber

    axios
      .get(`https://api.pancakeswap.com/api/singleLottery?lotteryNumber=${lotteryNumber}`)
      .then((res) => {
        setRoundData(res.data)
      })
      .catch((apiError) => {
        setError(true)
        console.log(apiError.response)
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
      {(!roundData && !error) || !loaded ? (
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
