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
  const [roundData, setRoundData] = useState(null)
  const [error, setError] = useState(false)

  const getInitialLotteryIndex = useCallback(async () => {
    const index = await getLotteryIssueIndex(lotteryContract)
    // for some reason the index returned here is out of range by 1
    setInputNumber(index - 1)
  }, [lotteryContract])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      getInitialLotteryIndex()
    }
  }, [account, lotteryContract, sushi, getInitialLotteryIndex])

  useEffect(() => {
    const getPastLotteryRoundData = () => {
      axios
        .get(`https://api.pancakeswap.com/api/singleLottery?lotteryNumber=${inputNumber}`)
        .then((res) => {
          setRoundData(res.data)
        })
        .catch((apiError) => {
          setError(true)
          console.log(apiError.response)
        })
    }
    getPastLotteryRoundData()
  }, [inputNumber])

  const onSubmit = () => {
    console.log(inputNumber)
  }

  return (
    <Wrapper>
      <PastLotterySearcher inputNumber={inputNumber} setInputNumber={setInputNumber} onSubmit={onSubmit} />
      {!roundData && !error ? (
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
