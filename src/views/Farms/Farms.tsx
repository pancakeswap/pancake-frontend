import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import Grid from 'components/layout/Grid'
import { useFarms, usePriceBnbBusd } from 'state/hooks'
import { QuoteToken } from 'sushi/lib/constants/types'
import useI18n from 'hooks/useI18n'
import Page from 'components/Page'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard'

interface FarmsProps {
  removed: boolean
}

const Farms: React.FC<FarmsProps> = ({ removed }) => {
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const bnbPrice = usePriceBnbBusd()

  const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
  const farmsToDisplay = removed
    ? farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')
    : farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')

  const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
    if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
      return farm
    }
    const cakeRewardPerBlock = CAKE_PER_BLOCK.times(farm.poolWeight)
    const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

    let apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)

    if (farm.quoteTokenSymbol === QuoteToken.BUSD) {
      apy = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken).times(bnbPrice)
    } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken)
    } else if (farm.dual) {
      const cakeApy =
        farm && cakePriceVsBNB.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
      const dualApy =
        farm.tokenPriceVsQuote &&
        new BigNumber(farm.tokenPriceVsQuote)
          .times(farm.dual.rewardPerBlock)
          .times(BLOCKS_PER_YEAR)
          .div(farm.lpTotalInQuoteToken)

      apy = cakeApy && dualApy && cakeApy.plus(dualApy)
    }

    return { ...farm, apy }
  })

  return (
    <Page>
      <Title>{TranslateString(320, 'Stake FLIP tokens to stack CAKE')}</Title>
      <StyledLink exact activeClassName="active" to="/staking">
        Staking
      </StyledLink>
      <Page>
        <Grid>
          {farmsToDisplayWithAPY.map((farm) => (
            <FarmCard key={farm.pid} farm={farm} removed={removed} />
          ))}
        </Grid>
      </Page>
      {removed ? (
        <NavLink exact activeClassName="active" to="/farms">
          Active Pools
        </NavLink>
      ) : (
        <NavLink exact activeClassName="active" to="/removed">
          Inactive Pools
        </NavLink>
      )}
      <Image src="/images/cakecat.png" />
    </Page>
  )
}

const StyledLink = styled(NavLink)`
  display: none;
  @media (max-width: 400px) {
    display: block;
    background: #50d7dd;
    border-radius: 5px;
    line-height: 40px;
    font-weight: 900;
    padding: 0 20px;
    margin-bottom: 30px;
    color: #fff;
  }
`

const Image = styled.img`
  @media (max-width: 500px) {
    width: 100vw;
  }
`

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 29px;
  width: 50vw;
  text-align: center;
  font-weight: 900;
  margin: 50px;
`

export default Farms
