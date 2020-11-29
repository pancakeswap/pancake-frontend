import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Switch } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { BaseLayout } from '@pancakeswap-libs/uikit'
import { getLotteryContract, getLotteryIssueIndex } from 'sushi/lotteryUtils'
import { getBalanceNumber } from 'utils/formatBalance'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import useSushi from 'hooks/useSushi'
import { useTotalRewards, useTotalClaim } from 'hooks/useTickets'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from '../../components/layout/Container'
import Hero from './components/Hero'
import Divider from './components/Divider'
import YourPrizesCard from './components/YourPrizesCard'
import UnlockWalletCard from './components/UnlockWalletCard'
import TicketCard from './components/TicketCard'
import LotteryCountdown from './components/LotteryCountdown'
import TotalPrizesCard from './components/TotalPrizesCard'
import WinningNumbers from './components/WinningNumbers'
import HowItWorks from './components/HowItWorks'

const Cards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
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

const Lottery: React.FC = () => {
  const { account } = useWallet()
  const TranslateString = useI18n()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const { claimAmount } = useTotalClaim()
  const [index, setIndex] = useState(0)

  const winnings = getBalanceNumber(claimAmount)
  const isAWin = winnings > 0

  const fetchIndex = useCallback(async () => {
    const issueIndex = await getLotteryIssueIndex(lotteryContract)
    setIndex(issueIndex)
  }, [lotteryContract])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      fetchIndex()
    }
  }, [account, lotteryContract, sushi, fetchIndex])

  return (
    <Switch>
      <Page>
        <Hero />
        <Container>
          {/* Uncomment when implementing 'Past Draws' <Divider /> */}
          <Cards>
            <div>
              <TotalPrizesCard />
            </div>
            <SecondCardColumnWrapper isAWin={isAWin}>
              {!account ? (
                <UnlockWalletCard />
              ) : (
                <>
                  <YourPrizesCard />
                  <TicketCard isSecondCard={isAWin} />
                </>
              )}
            </SecondCardColumnWrapper>
          </Cards>
          <HowItWorks />

          {/* legacy page content */}
          <WinningNumbers />
        </Container>
      </Page>
    </Switch>
  )
}

export default Lottery
