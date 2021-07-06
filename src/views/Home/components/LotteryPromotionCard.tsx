import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Skeleton } from '@pancakeswap/uikit'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }

  transition: opacity 200ms;
  &:hover {
    opacity: 0.65;
  }
`

const LotteryPromotionCard: React.FC<{ totalPrize: number }> = ({ totalPrize }) => {
  const { t } = useTranslation()

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/lottery" id="lottery-pot-cta">
        <CardBody>
          <Heading color="contrast" scale="lg">
            {t('Lottery')} V2
          </Heading>
          {!totalPrize ? (
            <>
              <Skeleton height={60} width={210} />
            </>
          ) : (
            <Balance fontSize="40px" color="#7645d9" bold prefix={`${t('Over')} $`} decimals={0} value={totalPrize} />
          )}
          <Flex justifyContent="space-between">
            <Heading color="contrast" scale="lg">
              {t('in Lottery Prizes!')}
            </Heading>
            <ArrowForwardIcon mt={30} color="primary" />
          </Flex>
        </CardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default LotteryPromotionCard
