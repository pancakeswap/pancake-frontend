import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import LotteryCardHeading from '../LotteryCardHeading'
import PastLotteryActions from './PastLotteryActions'

const CardHeading = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledHeading = styled(Heading)`
  margin-bottom: 24px;
`

const TopLotteryCardHeading = styled(LotteryCardHeading)`
  margin-bottom: 24px;
`

const PastRoundCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <CardHeading>
          <StyledHeading size="md">Round #51</StyledHeading>
          <TopLotteryCardHeading valueToDisplay={TranslateString(999, '1, 2, 3, 4')} Icon={TicketRound}>
            {TranslateString(999, 'Winning numbers')}
          </TopLotteryCardHeading>
          <LotteryCardHeading valueToDisplay={TranslateString(999, '100,000 CAKE')} Icon={PancakeRoundIcon}>
            {TranslateString(999, 'Total prizes')}
          </LotteryCardHeading>
        </CardHeading>
      </CardBody>
      <CardFooter>
        <span>Grid</span>
        <PastLotteryActions />
      </CardFooter>
    </Card>
  )
}

export default PastRoundCard
