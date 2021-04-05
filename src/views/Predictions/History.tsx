import { orderBy } from 'lodash'
import React from 'react'
import { useGetBets } from 'state/hooks'
import styled from 'styled-components'
import { Header, HistoricalBet } from './components/History'

const StyledHistory = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex-direction: column;
  height: 100%;
`

const BetWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
`

const History = () => {
  const bets = useGetBets()

  return (
    <StyledHistory>
      <Header />
      <BetWrapper>
        {bets &&
          orderBy(bets, ['round.epoch'], ['desc']).map((bet) => {
            return <HistoricalBet key={bet.id} bet={bet} />
          })}
      </BetWrapper>
    </StyledHistory>
  )
}

export default History
