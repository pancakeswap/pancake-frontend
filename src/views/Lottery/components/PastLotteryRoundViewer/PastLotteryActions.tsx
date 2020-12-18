import React from 'react'
import styled from 'styled-components'
import { Button, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useWallet } from 'use-wallet'
import useTickets from 'hooks/useTickets'
import MyTicketsModal from '../TicketCard/UserTicketsModal'
import UnlockButton from '../../../../components/UnlockButton'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[4]}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: space-between;
  }
`

const TicketCard: React.FC<{ contractLink?: string }> = ({ contractLink }) => {
  const TranslateString = useI18n()
  const tickets = useTickets()
  const ticketsLength = tickets.length
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)
  const { account } = useWallet()

  return (
    <Wrapper>
      <Button style={{ marginRight: '8px' }} as="a" href={contractLink} variant="secondary">
        View on BSCscan
      </Button>
      {!account ? (
        <UnlockButton />
      ) : (
        <Button disabled={ticketsLength === 0} onClick={onPresentMyTickets}>
          {TranslateString(999, 'View your tickets')}
        </Button>
      )}
    </Wrapper>
  )
}

export default TicketCard
