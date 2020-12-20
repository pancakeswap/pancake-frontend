import React from 'react'
import styled from 'styled-components'
import { Switch } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { BaseLayout } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalClaim } from 'hooks/useTickets'
import Page from 'components/layout/Page'
import Container from '../../components/layout/Container'
import Hero from './components/Hero'
import YourPrizesCard from './components/YourPrizesCard'
import UnlockWalletCard from './components/UnlockWalletCard'
import TicketCard from './components/TicketCard'
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

const Lottery: React.FC = () => {
  const { account } = useWallet()
  const { claimAmount } = useTotalClaim()
  const winnings = getBalanceNumber(claimAmount)
  const isAWin = winnings > 0

  // May be useful for 'Past draws'
  // const sushi = useSushi()
  // const lotteryContract = getLotteryContract(sushi)
  // const [index, setIndex] = useState(0)

  // const fetchIndex = useCallback(async () => {
  //   const issueIndex = await getLotteryIssueIndex(lotteryContract)
  //   setIndex(issueIndex)
  // }, [lotteryContract])

  // useEffect(() => {
  //   if (account && lotteryContract && sushi) {
  //     fetchIndex()
  //   }
  // }, [account, lotteryContract, sushi, fetchIndex])

  return (
    <Switch>
      <Page>
        <Hero />
        <Container>
          {/* Uncomment when implementing 'Past Draws' 
          <Divider /> */}
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
