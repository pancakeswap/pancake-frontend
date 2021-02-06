import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'
import { Pool } from 'state/types'

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(#53dee9, #7645d9);
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
const EarnAssetCard = () => {
  const TranslateString = useI18n()
  const latestPools: Pool[] = orderBy(pools, ['sortOrder', 'pid'], ['desc', 'desc']).slice(0, 3)

  // Always include CAKE
  const assets = ['CAKE', ...latestPools.map((pool) => pool.tokenName)].join(', ')

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading color="contrast" size="lg">
          {TranslateString(318, 'Earn')}
        </Heading>
        <CardMidContent color="invertedContrast">{assets}</CardMidContent>
        <Flex justifyContent="space-between">
          <Heading color="contrast" size="lg">
            {TranslateString(676, 'in Pools')}
          </Heading>
          <NavLink exact activeClassName="active" to="/syrup">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
