import React, { useCallback } from 'react'
import { Button } from '@pancakeswap-libs/uikit'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import styled from 'styled-components'
import ModalContent from '../../../components/ModalContent'
import { useWinningNumbers } from '../../../hooks/useTickets'
import useI18n from '../../../hooks/useI18n'

interface MyTicketsModalProps extends ModalProps {
  myTicketNumbers: Array<any>
  from?: string
}

const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  myTicketNumbers,
  onDismiss,
  from,
}) => {
  const winNumbers = useWinningNumbers()
  const TranslateString = useI18n()
  const rewardMatch = useCallback(
    (number) => {
      let n = 0
      for (let i = winNumbers.length - 1; i >= 0; i--) {
        if (winNumbers[i] == number[i]) n++
      }
      return n
    },
    [winNumbers],
  )

  const listItems = myTicketNumbers.map((number, index) => {
    if (rewardMatch(number[0]) > 1 && from !== 'buy') {
      const emoji = new Array(rewardMatch(number[0]) + 1).join('🤑')
      return (
        <RewardP key={index}>
          {emoji}
          {number.toString()}
          {emoji}
        </RewardP>
      )
    } else {
      return <p key={index}>{number.toString()}</p>
    }
  })

  return (
    <Modal>
      <ModalTitle
        text={TranslateString(
          490,
          `My Tickets (Total: ${myTicketNumbers.length})`,
        )}
      />
      <ModalContent>
        <div>
          <TicketsList>
            <h2>{listItems}</h2>
          </TicketsList>
        </div>
      </ModalContent>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(438, 'Close')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

const RewardP = styled.div`
  color: #ff8c28;
`

const TicketsList = styled.div`
  text-align: center;
  overflow-y: auto;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`

export default MyTicketsModal
