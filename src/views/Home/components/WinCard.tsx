import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from 'hooks/useTickets'
import useI18n from 'hooks/useI18n'

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  max-width: 344px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const Label = styled(Heading)`
  color: ${({ theme }) => theme.colors.display};
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  color: #7645d9;
`

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
`

const WinCard = () => {
  const TranslateString = useI18n()
  const lotteryPrizeAmount = +getBalanceNumber(useTotalRewards()).toFixed(0)
  const lotteryPrizeWithCommaSeparators = lotteryPrizeAmount.toLocaleString()

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Label mb={0}>Win up to</Label>
        <CardMidContent mb={0}>
          {lotteryPrizeWithCommaSeparators} {TranslateString(999, 'CAKE')}
        </CardMidContent>
        <Label>in Lottery</Label>
        <NavLink exact activeClassName="active" to="/lottery">
          <Row>
            <ArrowForwardIcon />
          </Row>
        </NavLink>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default WinCard
