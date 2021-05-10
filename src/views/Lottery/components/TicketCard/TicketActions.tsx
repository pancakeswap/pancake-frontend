import React from 'react'
import styled from 'styled-components'
import { Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useLotteryAllowance } from 'hooks/useAllowance'
import useTickets from 'hooks/useTickets'
import useTokenBalance from 'hooks/useTokenBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import { useApproval } from 'hooks/useApproval'
import BuyTicketModal from './BuyTicketModal'
import MyTicketsModal from './UserTicketsModal'
import PurchaseWarningModal from './PurchaseWarningModal'

const CardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[3]}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: space-between;
  }
`

const TicketCard: React.FC = () => {
  const { t } = useTranslation()
  const allowance = useLotteryAllowance()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const cakeBalance = useTokenBalance(getCakeAddress())
  const tickets = useTickets()
  const ticketsLength = tickets.length
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)
  const [onPresentApprove] = useModal(<PurchaseWarningModal />)
  const [onPresentBuy] = useModal(<BuyTicketModal max={cakeBalance} />)
  const { handleApprove, requestedApproval } = useApproval(onPresentApprove)

  const renderLotteryTicketButtons = () => {
    if (!allowance.toNumber()) {
      return (
        <>
          <Button width="100%" disabled>
            {t('View your tickets')}
          </Button>
          <Button width="100%" disabled={requestedApproval} onClick={handleApprove}>
            {t('Approve CAKE')}
          </Button>
        </>
      )
    }
    return (
      <>
        <Button
          style={{ marginRight: '8px' }}
          width="100%"
          disabled={ticketsLength === 0}
          variant="secondary"
          onClick={onPresentMyTickets}
        >
          {t('View your tickets')}
        </Button>
        <Button id="lottery-buy-start" width="100%" onClick={onPresentBuy}>
          {t('Buy ticket')}
        </Button>
      </>
    )
  }

  return (
    <CardActions>
      {lotteryHasDrawn ? <Button disabled> {t('On sale soon')}</Button> : renderLotteryTicketButtons()}
    </CardActions>
  )
}

export default TicketCard
