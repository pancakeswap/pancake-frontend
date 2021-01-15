import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(#53dee9, #7645d9);
  margin-left: auto;
  margin-right: auto;
  max-width: 344px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const Label = styled(Heading).attrs({ size: 'lg' })`
  font-size: 24px;
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  font-size: 40px;
  line-height: 44px;
`
const EarnAssetCard = () => {
  const TOKENS_TO_EXCLUDE = ['SYRUP']
  const tokenNames = pools.reduce((accum, pool) => {
    if (TOKENS_TO_EXCLUDE.includes(pool.tokenName)) {
      return accum
    }

    return [...accum.slice(0, 3), pool.tokenName]
  }, [])

  const assets = tokenNames.join(', ')

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Label mb={0} color="contrast">
          Earn
        </Label>
        <CardMidContent mb={0} color="invertedContrast">
          {assets}
        </CardMidContent>
        <Flex justifyContent="space-between">
          <Label>in Pools</Label>
          <NavLink exact activeClassName="active" to="/syrup">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
