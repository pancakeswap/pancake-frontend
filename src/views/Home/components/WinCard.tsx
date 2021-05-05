import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Skeleton } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import useLotteryTotalPrizesUsd from 'hooks/useLotteryTotalPrizesUsd'
import { useTranslation } from '../../../contexts/Localization'

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
  const { t } = useTranslation()
  const lotteryPrize = Math.round(useLotteryTotalPrizesUsd())

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading color="contrast" size="lg">
          {t('Lottery')}
        </Heading>
        <CardMidContent color="#7645d9">{t('Coming Soon')}</CardMidContent>
        <Flex justifyContent="space-between">
          <Heading color="contrast" size="lg" />
          <NavLink exact activeClassName="active" to="/lottery" id="lottery-pot-cta">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default WinCard
