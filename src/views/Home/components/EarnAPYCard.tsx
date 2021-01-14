import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
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
  color: ${({ theme }) => theme.colors.contrast};
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  color: #7645d9;
`
const Row = styled.div`
  display: flex;
  justify-content: flex-end;
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
        <Label mb={0}>Earn up to</Label>
        <CardMidContent mb={0}>
          {calculateAPY()
            ? `${calculateAPY().times(new BigNumber(100)).toNumber().toLocaleString('en-US').slice(0, -1)}%`
            : `Loading...`}{' '}
          {TranslateString(352, 'APY')}
        </CardMidContent>
        <Label>in Farms</Label>
        <NavLink exact activeClassName="active" to="/farms">
          <Row>
            <ArrowForwardIcon />
          </Row>
        </NavLink>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAPYCard
