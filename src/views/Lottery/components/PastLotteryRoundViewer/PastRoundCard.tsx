import React, { useState } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, CardFooter, Text, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import LotteryCardHeading from '../LotteryCardHeading'

const CardHeading = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
          <TopLotteryCardHeading valueToDisplay="1, 2, 3, 4" Icon={TicketRound}>
            Winning numbers
          </TopLotteryCardHeading>
          <LotteryCardHeading valueToDisplay="100,000 CAKE" Icon={PancakeRoundIcon}>
            Total prizes
          </LotteryCardHeading>
        </CardHeading>
      </CardBody>
      <CardFooter>
        <span>Grid</span>
      </CardFooter>
    </Card>
  )
}

export default PastRoundCard
