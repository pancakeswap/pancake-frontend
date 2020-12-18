import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Card, CardBody, CardFooter, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import LotteryCardHeading from '../LotteryCardHeading'
import PastLotteryActions from './PastLotteryActions'
import PrizeGrid from '../PrizeGrid'
import Timestamp from '../Timestamp'

const CardHeading = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledHeading = styled(Heading)`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

const TopLotteryCardHeading = styled(LotteryCardHeading)`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

const StyledText = styled(Text)`
  padding: ${(props) => props.theme.spacing[4]}px;
`

const PastRoundCard = ({ error, data }) => {
  const TranslateString = useI18n()

  /* eslint-disable no-debugger */
  const {
    burned,
    contractLink,
    jackpotTicket,
    lotteryDate,
    lotteryNumber,
    lotteryNumbers,
    match2Ticket,
    match3Ticket,
    poolJackpot,
    poolMatch2,
    poolMatch3,
    poolSize,
  } = data

  return (
    <Card>
      {error ? (
        <StyledText>Error fetching data</StyledText>
      ) : (
        data && (
          <>
            <CardBody>
              <CardHeading>
                <Timestamp timeValue={lotteryDate} />
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
              <PrizeGrid lotteryPrizeAmount={100000} pastDraw />
              <PastLotteryActions />
            </CardFooter>
          </>
        )
      )}
    </Card>
  )
}

export default PastRoundCard
