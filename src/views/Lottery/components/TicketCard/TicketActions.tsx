import React from 'react'
import styled from 'styled-components'
import { Button, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
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
  const TranslateString = useI18n()
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
            {TranslateString(432, 'View your tickets')}
          </Button>
          <Button width="100%" disabled={requestedApproval} onClick={handleApprove}>
            {TranslateString(494, 'Approve CAKE')}
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
          {TranslateString(432, 'View your tickets')}
        </Button>
        <Button id="lottery-buy-start" width="100%" onClick={onPresentBuy}>
          {TranslateString(430, 'Buy ticket')}
        </Button>
      </>
    )
  }

  return (
    <CardActions>
      {lotteryHasDrawn ? (
        <Button disabled> {TranslateString(874, 'On sale soon')}</Button>
      ) : (
        renderLotteryTicketButtons()
      )}
    </CardActions>
  )
}

export default TicketCard
