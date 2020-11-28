import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Card, Button, useModal, Text, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import CardContent from 'components/CardContent'
import CardIcon from 'components/CardIcon'
import Label from 'components/Label'
import Value from 'components/Value'
import { getBalanceNumber } from 'utils/formatBalance'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useMultiClaimLottery } from 'hooks/useBuyLottery'
import useTickets, { useTotalClaim } from 'hooks/useTickets'
import Loading from 'components/Loading'
import UnlockButton from '../../../../components/UnlockButton'
import UserTicketsModal from '../UserTicketsModal'

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  background-color: unset;
  box-shadow: unset;
  border: 1px solid ${({ theme }) => theme.colors.textDisabled};
`
const LoseInner = styled.div`
  display: flex;
  align-items: center;
`
const LoseImage = styled.img`
  margin-right: 20px;
`

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
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
  const isAWin = winnings > 0

  return (
    <StyledCard isDisabled={!isAWin}>
      <CardBody>
        {isAWin ? (
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>🎁</CardIcon>
              {claimLoading && <Loading />}
              {!claimLoading && <Value value={winnings} />}
              <Label text={TranslateString(482, 'CAKE prizes to be claimed!')} />
            </StyledCardHeader>
            <StyledCardActions>
              <Button fullWidth disabled={requestedClaim} onClick={handleClaim}>
                {TranslateString(480, 'Claim prizes')}
              </Button>
            </StyledCardActions>
          </StyledCardContentInner>
        ) : (
          <LoseInner>
            <LoseImage src="/images/no-prize.svg" alt="no prizes won" />
            <Text color="textDisabled">Sorry, no prizes to collect</Text>
          </LoseInner>
        )}
      </CardBody>
    </StyledCard>
  )
}

export default YourPrizesCard
