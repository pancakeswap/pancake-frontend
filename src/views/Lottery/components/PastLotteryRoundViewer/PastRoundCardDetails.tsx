import React from 'react'
import styled from 'styled-components'
import { Heading, CardBody, CardFooter, PancakeRoundIcon, TicketRound } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DataResponse } from 'utils/getLotteryRoundData'
import LotteryCardHeading from '../LotteryCardHeading'
import PastLotteryActions from './PastLotteryActions'
import PrizeGrid from '../PrizeGrid'
import Timestamp from '../Timestamp'

interface PastRoundCardDetailsProps {
  data: DataResponse
}

const CardHeading = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TopLotteryCardHeading = styled(LotteryCardHeading)`
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

const PastRoundCardDetails: React.FC<PastRoundCardDetailsProps> = ({ data }) => {
  const { t } = useTranslation()

  const {
    contractLink,
    jackpotTicket,
    lotteryDate,
    lotteryNumber,
    lotteryNumbers,
    match2Ticket,
    match3Ticket,
    poolSize,
  } = data

  return (
    !data.error &&
    data && (
      <>
        <CardBody>
          <CardHeading>
            <Timestamp timeValue={lotteryDate} />
            <Heading scale="md" mb="24px">
              Round #{lotteryNumber}
            </Heading>
            <TopLotteryCardHeading
              valueToDisplay={`${lotteryNumbers[0]}, ${lotteryNumbers[1]}, ${lotteryNumbers[2]}, ${lotteryNumbers[3]}`}
              Icon={TicketRound}
            >
              {t('Winning numbers')}
            </TopLotteryCardHeading>
            <LotteryCardHeading valueToDisplay={t(`${poolSize.toLocaleString()} CAKE`)} Icon={PancakeRoundIcon}>
              {t('Total prizes')}
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
