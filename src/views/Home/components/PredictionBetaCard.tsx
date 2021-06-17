import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap/uikit'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'

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
const CardMidContent = styled(Heading).attrs({ scale: 'xl' })`
  line-height: 44px;
`

const PredictionBetaCard = () => {
  const { t } = useTranslation()
  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/prediction" id="lottery-pot-cta">
        <CardBody>
          <Heading color="contrast" scale="lg">
            {t('Prediction Markets')}
          </Heading>
          <CardMidContent color="#7645d9" textTransform="uppercase">
            {t('Now Live')}
          </CardMidContent>
          <Flex justifyContent="space-between">
            <Heading color="contrast" scale="lg">
              {t('in Beta')}
            </Heading>
            <ArrowForwardIcon mt={30} color="primary" />
          </Flex>
        </CardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default PredictionBetaCard
