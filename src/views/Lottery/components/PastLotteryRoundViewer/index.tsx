import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import PastLotterySearcher from './PastLotterySearcher'
import PastRoundCard from './PastRoundCard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const PastLotteryRoundViewer = () => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <PastLotterySearcher />
      <PastRoundCard />
    </Wrapper>
  )
}

export default PastLotteryRoundViewer
