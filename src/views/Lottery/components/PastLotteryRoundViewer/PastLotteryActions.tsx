import React from 'react'
import styled from 'styled-components'
import { Button, LinkExternal, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useTickets from 'hooks/useTickets'
import UnlockButton from 'components/UnlockButton'
import MyTicketsModal from '../TicketCard/UserTicketsModal'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 24px;

  & > div {
    flex: 1;
    width: 100%;
  }
`

const ExternalLinkWrap = styled(LinkExternal)`
  align-items: center;
  display: flex;
  height: 48px;
  justify-content: center;
  text-decoration: none;
  width: 100%;
`

const TicketCard: React.FC<{ contractLink?: string; lotteryNumber?: number }> = ({ contractLink, lotteryNumber }) => {
  const TranslateString = useI18n()
  const tickets = useTickets(lotteryNumber)
  const ticketsLength = tickets.length
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)
  const { account } = useWallet()

  if (!account) {
    return (
      <Wrapper>
        <UnlockButton />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <div>
        <Button disabled={ticketsLength === 0} onClick={onPresentMyTickets} fullWidth>
          {TranslateString(999, 'View your tickets')}
        </Button>
      </div>
      <div>
        <ExternalLinkWrap href={contractLink}>{TranslateString(999, 'View on BscScan')}</ExternalLinkWrap>
      </div>
    </Wrapper>
  )
}

export default TicketCard
