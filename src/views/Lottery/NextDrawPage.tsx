import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BaseLayout } from '@pancakeswap-libs/uikit'
import { useTotalClaim } from 'hooks/useTickets'
import YourPrizesCard from './components/YourPrizesCard'
import UnlockWalletCard from './components/UnlockWalletCard'
import TicketCard from './components/TicketCard'
import TotalPrizesCard from './components/TotalPrizesCard'
import WinningNumbers from './components/WinningNumbers'
import HowItWorks from './components/HowItWorks'
import { getBalanceNumber } from '../../utils/formatBalance'

const Cards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const SecondCardColumnWrapper = styled.div<{ isAWin?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isAWin ? 'column' : 'column-reverse')};
`

const NextDrawPage: React.FC = () => {
  const { account } = useWeb3React()
  const { claimAmount, setLastUpdated } = useTotalClaim()
  const winnings = getBalanceNumber(claimAmount)
  const isAWin = winnings > 0

  const handleSuccess = useCallback(() => {
    setLastUpdated()
  }, [setLastUpdated])

  return (
    <>
      <Cards>
        <TotalPrizesCard />
        <SecondCardColumnWrapper isAWin={isAWin}>
          {!account ? (
            <UnlockWalletCard />
          ) : (
            <>
              <YourPrizesCard isAWin={isAWin} onSuccess={handleSuccess} />
              <TicketCard isSecondCard={isAWin} />
            </>
          )}
        </SecondCardColumnWrapper>
      </Cards>
      <HowItWorks />
      {/* legacy page content */}
      <WinningNumbers />
    </>
  )
}

export default NextDrawPage
