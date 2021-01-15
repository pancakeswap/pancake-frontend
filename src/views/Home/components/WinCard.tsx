import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from 'hooks/useTickets'
import { usePriceCakeBusd } from 'state/hooks'

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
  font-size: 24px;
`
const CardMidContent = styled(Heading)`
  font-size: 40px;
  line-height: 44px;
`
const WinCard = () => {
  const lotteryPrizeAmount = +getBalanceNumber(useTotalRewards()).toFixed(0)

  const cakePrize = usePriceCakeBusd()

  const cakePrizeUSD: any = `0.${cakePrize.c[0]}`
  const usdValue = cakePrizeUSD * lotteryPrizeAmount
  const lotteryPrize = Math.round(usdValue).toLocaleString()

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Label mb={0} color="contrast">
          Win up to
        </Label>
        <CardMidContent mb={0} color="#7645d9">
          ${lotteryPrize}
        </CardMidContent>
        <Flex justifyContent="space-between">
          <Label>in Lottery</Label>
          <NavLink exact activeClassName="active" to="/lottery">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default WinCard
