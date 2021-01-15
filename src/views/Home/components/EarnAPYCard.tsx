import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js'
import { useFarms } from 'state/hooks'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK } from 'config'

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
const EarnAPYCard = () => {
  const TranslateString = useI18n()
  const farmsLP = useFarms()

  const calculateAPY = () => {
    const farm = farmsLP[1]
    const cakePriceVsBNB = new BigNumber(farm?.tokenPriceVsQuote || 0)

    const cakeRewardPerBlock = CAKE_PER_BLOCK.times(farm.poolWeight)
    const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

    return cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)
  }

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Label mb={0} color="contrast">
          Earn up to
        </Label>
        <CardMidContent mb={0} color="#7645d9">
          {calculateAPY()
            ? `${calculateAPY().times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)}%`
            : `Loading...`}{' '}
          {TranslateString(352, 'APY')}
        </CardMidContent>
        <Flex justifyContent="space-between">
          <Label>in Farms</Label>
          <NavLink exact activeClassName="active" to="/farms">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAPYCard
