import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Flex, Button, Box, Ticket, useTooltip, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'
import { useLottery } from 'state/hooks'
import { fetchLottery } from 'state/lottery/helpers'
import useTheme from 'hooks/useTheme'
import TicketNumber from './TicketNumber'
import BuyTicketsButton from './BuyTicketsButton'

const StyledModal = styled(Modal)`
  min-width: 280px;
  max-width: 320px;
`
const ScrollBox = styled(Box)`
  max-height: 300px;
  overflow-y: scroll;
`

interface ViewTicketsModalProps {
  roundId: string
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<ViewTicketsModalProps> = ({ onDismiss, roundId }) => {
  const [inactiveLotteryData, setInactiveLotteryData] = useState(null)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const {
    currentLotteryId,
    isTransitioning,
    currentRound: { status, userTickets },
  } = useLottery()
  const isPreviousRound = roundId !== currentLotteryId
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  useEffect(() => {
    if (isPreviousRound) {
      const fetchedLotteryData = fetchLottery(roundId)
      setInactiveLotteryData(fetchedLotteryData)
    }
  }, [roundId, isPreviousRound])

  return (
    <StyledModal
      title={`${t('Round')} ${roundId}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {isPreviousRound ? (
        <span>Previous round</span>
      ) : (
        <>
          <Flex flexDirection="column">
            <Text textTransform="uppercase" color="secondary" fontSize="12px" mb="16px">
              {t('Your tickets')}
            </Text>
            <ScrollBox>
              {userTickets.tickets.map((ticket, index) => {
                return <TicketNumber key={ticket.id} localId={index + 1} {...ticket} />
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
