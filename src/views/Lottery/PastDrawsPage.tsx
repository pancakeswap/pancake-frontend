import React from 'react'
import styled from 'styled-components'
import { BaseLayout } from '@pancakeswap-libs/uikit'
import PastLotteryRoundViewer from './components/PastLotteryRoundViewer'
import PastDrawsHistoryCard from './components/PastDrawsHistoryCard'

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
  flex-direction: column;
`

const BunnyImageWrapper = styled.div`
  display: flex;
  margin-top: 32px;
  justify-content: center;
`

const StyledImage = styled.img``

const PastDrawsPage: React.FC = () => {
  return (
    <Cards>
      <PastLotteryRoundViewer />
      <SecondCardColumnWrapper>
        <PastDrawsHistoryCard />
        <BunnyImageWrapper>
          <StyledImage src="/images/pancake-lottery-bunny.png" alt="lottery bunny" />
        </BunnyImageWrapper>
      </SecondCardColumnWrapper>
    </Cards>
  )
}

export default PastDrawsPage
