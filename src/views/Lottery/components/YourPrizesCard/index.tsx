import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Card, Button, useModal, Heading, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useMultiClaimLottery } from 'hooks/useBuyLottery'
import useTickets, { useTotalClaim } from 'hooks/useTickets'
import Loading from 'components/Loading'
import UserTicketsModal from '../UserTicketsModal'
import NoPrizesContent from './NoPrizesContent'

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  ${(props) =>
    props.isDisabled
      ? `  
        background-color: unset;
        box-shadow: unset;
        border: 1px solid ${({ theme }) => theme.colors.textDisabled};
        `
      : ``}
`

const WinningsWrapper = styled.div`
  display: flex;
  align-items: baseline;
`

const StyledCardActions = styled.div`
  margin-top: ${(props) => props.theme.spacing[3]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const YourPrizesCard: React.FC = () => {
  const [requestedClaim, setRequestedClaim] = useState(false)
  const { account } = useWallet()
  const TranslateString = useI18n()
  const tickets = useTickets()
  const [onPresentMyTickets] = useModal(<UserTicketsModal myTicketNumbers={tickets} />)
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const { claimLoading, claimAmount } = useTotalClaim()

  const { onMultiClaim } = useMultiClaimLottery()

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

  console.log(`number: ${getBalanceNumber(claimAmount)}`)

  const winnings = getBalanceNumber(claimAmount)
  //   const isAWin = winnings > 0
  const isAWin = true

  return (
    <StyledCard isDisabled={!isAWin} isActive={isAWin}>
      <CardBody>
        {isAWin ? (
          <StyledCardContentInner>
            {/* 'won' icon to go here after uikit update */}
            <Heading as="h3" size="lg" color="secondary" style={{}}>
              You won!
            </Heading>
            {claimLoading && <Loading />}
            {!claimLoading && (
              <>
                <WinningsWrapper>
                  <Heading as="h4" size="xl" style={{ marginRight: '6px' }}>
                    {winnings}
                  </Heading>
                  <Heading as="h4" size="lg">
                    CAKE
                  </Heading>
                </WinningsWrapper>
              </>
            )}
            <StyledCardActions>
              <Button fullWidth disabled={requestedClaim} onClick={handleClaim}>
                {TranslateString(999, 'Collect')}
              </Button>
            </StyledCardActions>
          </StyledCardContentInner>
        ) : (
          <NoPrizesContent />
        )}
      </CardBody>
    </StyledCard>
  )
}

export default YourPrizesCard
