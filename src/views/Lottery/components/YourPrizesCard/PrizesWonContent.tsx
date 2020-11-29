import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { useMultiClaimLottery } from 'hooks/useBuyLottery'
import { useTotalClaim } from 'hooks/useTickets'
import Loading from 'components/Loading'

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

const PrizesWonContent: React.FC = () => {
  const [requestedClaim, setRequestedClaim] = useState(false)
  const TranslateString = useI18n()
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

  const winnings = getBalanceNumber(claimAmount)

  return (
    <StyledCardContentInner>
      {/* 'won' icon to go here after uikit update */}
      <Heading as="h3" size="lg" color="secondary">
        {TranslateString(999, 'You won!')}
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
  )
}

export default PrizesWonContent
