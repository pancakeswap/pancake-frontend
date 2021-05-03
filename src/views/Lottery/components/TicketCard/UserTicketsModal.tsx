import React, { useCallback } from 'react'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useWinningNumbers } from 'hooks/useTickets'
import { useTranslation } from 'contexts/Localization'

interface UserTicketsModalProps {
  myTicketNumbers: Array<any>
  from?: string
  onDismiss?: () => void
}

const UserTicketsModal: React.FC<UserTicketsModalProps> = ({ myTicketNumbers, onDismiss, from }) => {
  const winNumbers = useWinningNumbers()
  const { t } = useTranslation()
  const rewardMatch = useCallback(
    (number) => {
      let n = 0
      for (let i = winNumbers.length - 1; i >= 0; i--) {
        // eslint-disable-next-line eqeqeq
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
        // eslint-disable-next-line react/no-array-index-key
        <RewardP key={index}>
          {emoji}
          {number.toString()}
          {emoji}
        </RewardP>
      )
    }
    // eslint-disable-next-line react/no-array-index-key
    return <p key={index}>{number.toString()}</p>
  })

  return (
    <Modal title={t('My Tickets (Total: %TICKETS%)', { TICKETS: myTicketNumbers.length })} onDismiss={onDismiss}>
      <TicketsList>
        <h2>{listItems}</h2>
      </TicketsList>
      <StyledButton variant="secondary" onClick={onDismiss}>
        {t('Close')}
      </StyledButton>
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

const StyledButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]}px;
`

export default UserTicketsModal
