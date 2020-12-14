import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useWallet } from 'use-wallet'
import useTickets from 'hooks/useTickets'
import MyTicketsModal from '../TicketCard/UserTicketsModal'
import UnlockButton from '../../../../components/UnlockButton'

const CardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[3]}px;
`

const TicketCard: React.FC = () => {
  const TranslateString = useI18n()
  const tickets = useTickets()
  const ticketsLength = tickets.length
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)
  const { account } = useWallet()

  return (
    <CardActions>
      <Button
        style={{ marginRight: '8px' }}
        as="a"
        href="https://bscscan.com/address/0x3c3f2049cc17c136a604be23cf7e42745edf3b91"
        variant="secondary"
      >
        View on BSCscan
      </Button>
      {!account ? (
        <UnlockButton />
      ) : (
        <Button disabled={ticketsLength === 0} onClick={onPresentMyTickets}>
          {TranslateString(999, 'View your tickets')}
        </Button>
      )}
    </CardActions>
  )
}

export default TicketCard
