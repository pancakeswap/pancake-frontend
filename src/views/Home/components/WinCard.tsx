import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import useLotteryTotalPrizesUsd from 'hooks/useLotteryTotalPrizesUsd'

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`
const WinCard = () => {
  const TranslateString = useI18n()
  const lotteryPrize = Math.round(useLotteryTotalPrizesUsd()).toLocaleString()

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading color="contrast" size="lg">
          {TranslateString(290, 'Lottery with')}
        </Heading>
        <CardMidContent color="#7645d9">${lotteryPrize}</CardMidContent>
        <Flex justifyContent="space-between">
          <Heading color="contrast" size="lg">
            up for grabs
          </Heading>
          <NavLink exact activeClassName="active" to="/lottery">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default WinCard
