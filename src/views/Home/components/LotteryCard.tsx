import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getCakeAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMultiClaimLottery } from 'hooks/useBuyLottery'
import { useTotalClaim } from 'hooks/useTickets'
import { useLotteryAllowance } from 'hooks/useAllowance'
import { useApproval } from 'hooks/useApproval'
import PurchaseWarningModal from 'views/Lottery/components/TicketCard/PurchaseWarningModal'
import BuyTicketModal from 'views/Lottery/components/TicketCard/BuyTicketModal'
import UnlockButton from 'components/UnlockButton'
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

const LotteryCard = () => {
  const { account } = useWeb3React()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const [requestClaim, setRequestedClaim] = useState(false)
  const { t } = useTranslation()
  const allowance = useLotteryAllowance()
  const [onPresentApprove] = useModal(<PurchaseWarningModal />)
  const { claimAmount, setLastUpdated } = useTotalClaim()
  const { onMultiClaim } = useMultiClaimLottery()
  const cakeBalance = useTokenBalance(getCakeAddress())
  const { handleApprove, requestedApproval } = useApproval(onPresentApprove)

  const handleClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)
      const txHash = await onMultiClaim()
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedClaim(false)
        setLastUpdated()
      }
    } catch (e) {
      console.error(e)
    }
  }, [onMultiClaim, setRequestedClaim, setLastUpdated])

  const renderLotteryTicketButtonBuyOrApprove = () => {
    if (!allowance.toNumber()) {
      return (
        <Button width="100%" disabled={requestedApproval} onClick={handleApprove}>
          {t('Approve CAKE')}
        </Button>
      )
    }
    if (lotteryHasDrawn) {
      return <Button disabled> {t('On sale soon')}</Button>
    }
    return (
      <Button id="dashboard-buy-tickets" variant="secondary" onClick={onPresentBuy}>
        {t('Buy Tickets')}
      </Button>
    )
  }

  const [onPresentBuy] = useModal(<BuyTicketModal max={cakeBalance} />)

  return (
    <StyledLotteryCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('Your Lottery Winnings')}
        </Heading>
        <CardImage src="/images/ticket.svg" alt="cake logo" width={64} height={64} />
        <Block>
          <Label>{t('CAKE to Collect')}:</Label>
          <CakeWinnings claimAmount={claimAmount} />
        </Block>
        <Block>
          <Label>{t('Total jackpot this round')}:</Label>
          <LotteryJackpot />
        </Block>
        {account ? (
          <Actions>
            <Button
              id="dashboard-collect-winnings"
              disabled={getBalanceNumber(claimAmount) === 0 || requestClaim}
              onClick={handleClaim}
              style={{ marginRight: '8px' }}
            >
              {t('Collect Winnings')}
            </Button>
            {renderLotteryTicketButtonBuyOrApprove()}
          </Actions>
        ) : (
          <Actions>
            <UnlockButton width="100%" />
          </Actions>
        )}
      </CardBody>
    </StyledLotteryCard>
  )
}

export default LotteryCard
