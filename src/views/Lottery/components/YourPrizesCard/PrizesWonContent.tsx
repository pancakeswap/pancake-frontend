import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, PresentWonIcon, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { useMultiClaimLottery } from 'views/Lottery/hooks/useBuyLottery'
import useTickets, { useTotalClaim } from 'views/Lottery/hooks/useTickets'
import Loading from '../Loading'
import MyTicketsModal from '../TicketCard/UserTicketsModal'

const WinningsWrapper = styled.div`
  display: flex;
  align-items: baseline;
`

const IconWrapper = styled.div`
  margin-bottom: 16px;

  svg {
    width: 80px;
    height: 80px;
  }
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

const StyledButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[1]}px;
`

interface PrizesWonContentProps {
  onSuccess: () => void
}

const PrizesWonContent: React.FC<PrizesWonContentProps> = ({ onSuccess }) => {
  const [requestedClaim, setRequestedClaim] = useState(false)
  const { t } = useTranslation()
  const { claimLoading, claimAmount } = useTotalClaim()
  const { onMultiClaim } = useMultiClaimLottery()
  const tickets = useTickets()
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)

  const handleClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)
      const txHash = await onMultiClaim()
      // user rejected tx or didn't go thru
      if (txHash) {
        onSuccess()
        setRequestedClaim(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onMultiClaim, setRequestedClaim, onSuccess])

  const winnings = getBalanceNumber(claimAmount).toFixed(2)

  return (
    <StyledCardContentInner>
      <IconWrapper>
        <PresentWonIcon />
      </IconWrapper>
      <Heading as="h3" scale="lg" color="secondary">
        {t('You won!')}
      </Heading>
      {claimLoading && <Loading />}
      {!claimLoading && (
        <>
          <WinningsWrapper>
            <Heading as="h4" scale="xl" style={{ marginRight: '6px' }}>
              {winnings}
            </Heading>
            <Heading as="h4" scale="lg">
              CAKE
            </Heading>
          </WinningsWrapper>
        </>
      )}
      <StyledCardActions>
        <Button width="100%" disabled={requestedClaim} onClick={handleClaim}>
          {t('Collect')}
        </Button>
      </StyledCardActions>
      <StyledButton variant="text" onClick={onPresentMyTickets}>
        {t('View your tickets')}
      </StyledButton>
    </StyledCardContentInner>
  )
}

export default PrizesWonContent
