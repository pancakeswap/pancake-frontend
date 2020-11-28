import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Switch } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { Heading, Card, CardBody, Button, BaseLayout } from '@pancakeswap-libs/uikit'
import { getLotteryContract, getLotteryIssueIndex } from 'sushi/lotteryUtils'
import { getBalanceNumber } from 'utils/formatBalance'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import useSushi from 'hooks/useSushi'
import { useTotalRewards } from 'hooks/useTickets'
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

const Cards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 48px;

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

const Lottery: React.FC = () => {
  const { account } = useWallet()
  const TranslateString = useI18n()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const [index, setIndex] = useState(0)

  const fetchIndex = useCallback(async () => {
    const issueIndex = await getLotteryIssueIndex(lotteryContract)
    setIndex(issueIndex)
  }, [lotteryContract])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      fetchIndex()
    }
  }, [account, lotteryContract, sushi, fetchIndex])

  const lotteryPrizeAmount = useTotalRewards()

  const subtitleText = TranslateString(
    426,
    'Spend CAKE to buy tickets, contributing to the lottery pot. Win prizes if 2, 3, or 4 of your ticket numbers match the winning numbers and their exact order! Good luck!',
  )

  return (
    <Switch>
      <Page>
        <Hero />
        <Container>
          <Divider />
          {/* NextDraw */}
          <Cards>
            <div>
              <TotalPrizesCard />
            </div>
            <div>
              {!account ? (
                <UnlockWalletCard />
              ) : (
                <>
                  <YourPrizesCard />
                  <TicketCard />
                </>
              )}
            </div>
          </Cards>

          {account && (
            <Subtitle>
              {!lotteryHasDrawn ? `#${index - 2} - Phase 1 - Buy Tickets` : `#${index - 2} - Phase 2 - Claim Winnings`}
            </Subtitle>
          )}
          <Title style={{ marginTop: '0.5em' }}>
            💰
            <br />
            {TranslateString(422, 'WIN')}
          </Title>
          <Title2>{getBalanceNumber(lotteryPrizeAmount).toFixed(2)} CAKE</Title2>
          <Subtitle>{subtitleText}</Subtitle>

          <LotteryCountdown />
          <WinningNumbers />
        </Container>
      </Page>
    </Switch>
  )
}

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 56px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
  margin-top: 0.5em;

  @media (max-width: 600px) {
    font-size: 40px;
  }
`

const Title2 = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 56px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;

  @media (max-width: 600px) {
    font-size: 38px;
  }
`

const Subtitle = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 20px;
  width: 50vw;
  text-align: center;
  font-weight: 600;
  margin-top: 0.8em;

  @media (max-width: 600px) {
    font-size: 16px;
    width: 80vw;
  }
`
const StyledCardWrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`

const StyledFarm = styled.div`
  margin-top: 2.5em;
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

export default Lottery
