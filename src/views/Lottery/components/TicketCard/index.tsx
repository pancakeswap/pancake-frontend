import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, TicketRound, Text, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useGetLotteryHasDrawn from 'views/Lottery/hooks/useGetLotteryHasDrawn'
import useTickets from 'views/Lottery/hooks/useTickets'
import { useCurrentTime } from 'hooks/useTimer'
import TicketActions from './TicketActions'
import { getTicketSaleTime } from '../../helpers/CountdownHelpers'

interface CardProps {
  isSecondCard?: boolean
}

const StyledCard = styled(Card)<CardProps>`
  ${(props) =>
    props.isSecondCard
      ? `  
        margin-top: 16px;

        ${props.theme.mediaQueries.sm} {
          margin-top: 24px;
        }

        ${props.theme.mediaQueries.lg} {
          margin-top: 32px;
        }
        `
      : ``}
`

const CardHeader = styled.div`
  align-items: center;
  display: flex;
`

const IconWrapper = styled.div`
  margin-right: 16px;
  svg {
    width: 48px;
    height: 48px;
  }
`

const TicketCountWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TicketCard: React.FC<CardProps> = ({ isSecondCard = false }) => {
  const { t } = useTranslation()
  const lotteryHasDrawn = useGetLotteryHasDrawn()

  const tickets = useTickets()
  const ticketsLength = tickets.length

  const currentMillis = useCurrentTime()
  const timeUntilTicketSale = lotteryHasDrawn && getTicketSaleTime(currentMillis)

  return (
    <StyledCard isSecondCard={isSecondCard}>
      <CardBody>
        <CardHeader>
          <IconWrapper>
            <TicketRound />
          </IconWrapper>
          {lotteryHasDrawn ? (
            <TicketCountWrapper>
              <Text fontSize="14px" color="textSubtle">
                {t('Until ticket sale:')}
              </Text>
              <Heading scale="lg">{timeUntilTicketSale}</Heading>
            </TicketCountWrapper>
          ) : (
            <TicketCountWrapper>
              <Text fontSize="14px" color="textSubtle">
                {t('Your tickets for this round')}
              </Text>
              <Heading scale="lg">{ticketsLength}</Heading>
            </TicketCountWrapper>
          )}
        </CardHeader>
        <TicketActions />
      </CardBody>
    </StyledCard>
  )
}

export default TicketCard
