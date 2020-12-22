import React from 'react'
import styled from 'styled-components'
import { Heading, CardBody, CardFooter, PancakeRoundIcon, TicketRound } from '@pancakeswap-libs/uikit'
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

const TopLotteryCardHeading = styled(LotteryCardHeading)`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

const PastRoundCardDetails = ({ data }) => {
  const TranslateString = useI18n()

  const {
    // burned,
    contractLink,
    jackpotTicket,
    lotteryDate,
    lotteryNumber,
    lotteryNumbers,
    match2Ticket,
    match3Ticket,
    // poolJackpot,
    // poolMatch2,
    // poolMatch3,
    poolSize,
  } = data

  return (
    !data.error &&
    data && (
      <>
        <CardBody>
          <CardHeading>
            <Timestamp timeValue={lotteryDate} />
            <Heading size="md" mb="24px">
              Round #{lotteryNumber}
            </Heading>
            <TopLotteryCardHeading
              valueToDisplay={`${lotteryNumbers[0]}, ${lotteryNumbers[1]}, ${lotteryNumbers[2]}, ${lotteryNumbers[3]}`}
              Icon={TicketRound}
            >
              {TranslateString(999, 'Winning numbers')}
            </TopLotteryCardHeading>
            <LotteryCardHeading
              valueToDisplay={TranslateString(999, `${poolSize.toLocaleString()} CAKE`)}
              Icon={PancakeRoundIcon}
            >
              {TranslateString(999, 'Total prizes')}
            </LotteryCardHeading>
          </CardHeading>
        </CardBody>
        <CardFooter>
          <PrizeGrid
            lotteryPrizeAmount={poolSize}
            jackpotMatches={jackpotTicket}
            twoTicketMatches={match2Ticket}
            threeTicketMatches={match3Ticket}
            pastDraw
          />
          <PastLotteryActions contractLink={contractLink} lotteryNumber={lotteryNumber} />
        </CardFooter>
      </>
    )
  )
}

export default PastRoundCardDetails
