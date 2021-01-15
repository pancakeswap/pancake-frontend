import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import Grid from 'components/layout/Grid'
import { useFarms, usePriceBnbBusd } from 'state/hooks'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import Page from 'components/Page'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const bnbPrice = usePriceBnbBusd()

  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')

  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
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
      return farmsToDisplayWithAPY.map((farm) => <FarmCard key={farm.pid} farm={farm} removed={removed} />)
    },
    [bnbPrice, farmsLP],
  )

  return (
    <Page>
      <Title>{TranslateString(999, 'Stake LP tokens to earn CAKE')}</Title>
      <FarmTabButtons />
      <Page>
        <Divider />
        <Route exact path={`${path}`}>
          <Grid>{farmsList(activeFarms, false)}</Grid>
        </Route>
        <Route exact path={`${path}/history`}>
          <Grid>{farmsList(inactiveFarms, true)}</Grid>
        </Route>
      </Page>
      <Image src="/images/cakecat.png" />
    </Page>
  )
}

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
