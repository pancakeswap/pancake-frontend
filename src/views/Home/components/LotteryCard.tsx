import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, useModal } from '@pancakeswap-libs/uikit'
import { getCakeAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMultiClaimLottery } from 'hooks/useBuyLottery'
import { useTotalClaim } from 'hooks/useTickets'
import BuyModal from 'views/Lottery/components/TicketCard/BuyTicketModal'
import CakeWinnings from './CakeWinnings'
import LotteryJackpot from './LotteryJackpot'

const StyledLotteryCard = styled(Card)`
  background-image: url('/images/ticket-bg.svg');
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  display: flex;
  margin-top: 24px;
  button {
    flex: 1 0 50%;
  }
`

const FarmedStakingCard = () => {
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const [requesteClaim, setRequestedClaim] = useState(false)
  const TranslateString = useI18n()
  const { claimAmount } = useTotalClaim()
  const { onMultiClaim } = useMultiClaimLottery()
  const cakeBalance = useTokenBalance(getCakeAddress())

  const handleClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)
      const txHash = await onMultiClaim()
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedClaim(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onMultiClaim, setRequestedClaim])

  const [onPresentBuy] = useModal(<BuyModal max={cakeBalance} tokenName="CAKE" />)

  return (
    <StyledLotteryCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(550, 'Your Lottery Winnings')}
        </Heading>
        <CardImage src="/images/ticket.svg" alt="cake logo" width={64} height={64} />
        <Block>
          <CakeWinnings />
          <Label>{TranslateString(552, 'CAKE to Collect')}</Label>
        </Block>
        <Block>
          <LotteryJackpot />
          <Label>{TranslateString(554, 'Total jackpot this round')}</Label>
        </Block>
        <Actions>
          <Button
            id="dashboard-collect-winnings"
            disabled={getBalanceNumber(claimAmount) === 0 || requesteClaim}
            onClick={handleClaim}
            style={{ marginRight: '8px' }}
          >
            {TranslateString(556, 'Collect Winnings')}
          </Button>
          <Button id="dashboard-buy-tickets" variant="secondary" onClick={onPresentBuy} disabled={lotteryHasDrawn}>
            {TranslateString(558, 'Buy Tickets')}
          </Button>
        </Actions>
      </CardBody>
    </StyledLotteryCard>
  )
}

export default FarmedStakingCard
