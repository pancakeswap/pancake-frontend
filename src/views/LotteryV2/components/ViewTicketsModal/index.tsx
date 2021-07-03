import React from 'react'
import styled from 'styled-components'
import { Modal, Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryStatus } from 'config/constants/types'
import { useLottery } from 'state/hooks'
import useTheme from 'hooks/useTheme'
import TicketNumber from '../TicketNumber'
import BuyTicketsButton from '../BuyTicketsButton'
import HistoricTicketsInner from './HistoricTicketsInner'

const StyledModal = styled(Modal)`
  min-width: 280px;
  max-width: 320px;
`
const ScrollBox = styled(Box)`
  max-height: 300px;
  overflow-y: scroll;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 20px;
`

interface ViewTicketsModalProps {
  roundId: string
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<ViewTicketsModalProps> = ({ onDismiss, roundId, roundStatus }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const {
    isTransitioning,
    currentRound: { status, userTickets },
  } = useLottery()
  const isPreviousRound = roundStatus.toLowerCase() === LotteryStatus.CLAIMABLE
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  return (
    <StyledModal
      title={`${t('Round')} ${roundId}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {isPreviousRound ? (
        <HistoricTicketsInner roundId={roundId} />
      ) : (
        <>
          <Flex flexDirection="column">
            <Text bold textTransform="uppercase" color="secondary" fontSize="12px" mb="16px">
              {t('Your tickets')}
            </Text>
            <ScrollBox>
              {userTickets.tickets.map((ticket, index) => {
                return <TicketNumber key={ticket.id} localId={index + 1} id={ticket.id} number={ticket.number} />
              })}
            </ScrollBox>
          </Flex>
          <Flex borderTop={`1px solid ${theme.colors.cardBorder}`} alignItems="center" justifyContent="center">
            <BuyTicketsButton disabled={ticketBuyIsDisabled} mt="24px" width="100%" />
          </Flex>
        </>
      )}
    </StyledModal>
  )
}

export default ViewTicketsModal
