import React from 'react'
import styled from 'styled-components'
import { Button, LinkExternal, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
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
  const { t } = useTranslation()
  const tickets = useTickets(lotteryNumber)
  const ticketsLength = tickets.length
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)
  const { account } = useWeb3React()

  if (!account) {
    return (
      <Wrapper>
        <UnlockButton />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Button disabled={ticketsLength === 0} onClick={onPresentMyTickets} width="100%">
        {t('View your tickets')}
      </Button>
      <ExternalLinkWrap href={contractLink}>{t('View on BscScan')}</ExternalLinkWrap>
    </Wrapper>
  )
}

export default TicketCard
