import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Button, useModal, Card, CardBody, PancakeRoundIcon, Text, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useLotteryAllowance } from 'hooks/useAllowance'
import { useLotteryApprove } from 'hooks/useApprove'
import useTickets from 'hooks/useTickets'
import useSushi from 'hooks/useSushi'
import useTokenBalance from 'hooks/useTokenBalance'
import { getSushiAddress } from 'sushi/utils'
import BuyTicketModal from './BuyTicketModal'
import MyTicketsModal from './UserTicketsModal'
import PurchaseWarningModal from './PurchaseWarningModal'
import { getTicketSaleTime } from '../../helpers/CountdownHelpers'

const CardHeader = styled.div`
  align-items: center;
  display: flex;
`

const IconWrapper = styled.div`
  margin-right: 16px;
  svg {
    width: 48px;
    height: 48px;
  }
`

const TicketCountWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const CardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[3]}px;
`

const TicketCard: React.FC = () => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const TranslateString = useI18n()
  const allowance = useLotteryAllowance()
  const { onApprove } = useLotteryApprove()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  // const lotteryHasDrawn = true
  const timeUntilTicketSale = lotteryHasDrawn && getTicketSaleTime(Date.now())
  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))

  const tickets = useTickets()
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)
  const [onPresentApprove] = useModal(<PurchaseWarningModal />)
  const [onPresentBuy] = useModal(<BuyTicketModal max={sushiBalance} tokenName="CAKE" />)

  const ticketsLength = tickets.length

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
      onPresentApprove()
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, onPresentApprove])

  const renderLotteryTicketButtons = () => {
    if (!allowance.toNumber()) {
      return (
        <Button fullWidth disabled={requestedApproval} onClick={handleApprove}>
          {TranslateString(998, 'Approve CAKE')}
        </Button>
      )
    }
    return (
      <Button fullWidth onClick={onPresentBuy}>
        {TranslateString(430, 'Buy ticket')}
      </Button>
    )
  }

  return (
    <Card>
      <CardBody>
        <CardHeader>
          <IconWrapper>
            <PancakeRoundIcon />
          </IconWrapper>
          {lotteryHasDrawn ? (
            <TicketCountWrapper>
              <Text fontSize="14px" color="textSubtle">
                {TranslateString(999, 'Until ticket sale:')}
              </Text>
              <Heading size="lg">{timeUntilTicketSale}</Heading>
            </TicketCountWrapper>
          ) : (
            <TicketCountWrapper>
              <Text fontSize="14px" color="textSubtle">
                {TranslateString(999, 'Your tickets for this round')}
              </Text>
              <Heading size="lg">{ticketsLength}</Heading>
            </TicketCountWrapper>
          )}
        </CardHeader>
        <CardActions>
          {lotteryHasDrawn ? (
            <Button disabled> {TranslateString(999, 'On sale soon')}</Button>
          ) : (
            renderLotteryTicketButtons()
          )}
        </CardActions>
        {ticketsLength > 0 && (
          <MyTicketsP onClick={onPresentMyTickets}>{TranslateString(432, 'View your tickets')}</MyTicketsP>
        )}
      </CardBody>
    </Card>
  )
}

const MyTicketsP = styled.div`
  cursor: pointer;
  margin-top: 1.35em;
  color: ${(props) => props.theme.colors.secondary};
`

export default TicketCard
