import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import useSushi from 'hooks/useSushi'
import { useWallet } from 'use-wallet'
import { getLotteryContract, getLotteryIssueIndex } from '../../../../sushi/lotteryUtils'
import PastLotterySearcher from './PastLotterySearcher'
import PastRoundCard from './PastRoundCard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const PastLotteryRoundViewer = () => {
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const { account } = useWallet()
  const [lotteryIndex, setLotteryIndex] = useState(0)
  const [inputNumber, setInputNumber] = useState(lotteryIndex)
  const [roundData, setRoundData] = useState(null)
  const [error, setError] = useState(false)

  const getInitialLotteryIndex = useCallback(async () => {
    const index = await getLotteryIssueIndex(lotteryContract)
    setLotteryIndex(index)
  }, [lotteryContract])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      getInitialLotteryIndex()
    }
  }, [account, lotteryContract, sushi, getInitialLotteryIndex])

  useEffect(() => {
    const getPastLotteryRoundData = () => {
      axios
        .get(`https://api.pancakeswap.com/api/singleLottery?lotteryNumber=${lotteryIndex}`)
        .then((res) => {
          setRoundData(res.data)
        })
        .catch((apiError) => {
          setError(true)
          console.log(apiError.response)
        })
    }
    getPastLotteryRoundData()
  }, [lotteryIndex])

  const onSubmit = () => {
    console.log(inputNumber)
  }

  return (
    <Wrapper>
      <PastLotterySearcher />
      <PastRoundCard error={error} />
    </Wrapper>
  )
}

export default PastLotteryRoundViewer
