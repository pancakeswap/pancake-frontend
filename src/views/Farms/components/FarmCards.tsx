// @ts-nocheck
import React from 'react'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import { farmsConfig } from 'sushi/lib/constants'
import { Farm } from 'types/farms'
import { useTokenBalance2 } from 'hooks/useTokenBalance'
import { useBnbPriceUSD } from 'hooks/usePrices'
import useFarms from 'hooks/useFarms'
import useAllStakedValue, { StakedValue } from 'hooks/useAllStakedValue'
import Page from 'components/layout/Page'
import Grid from 'components/layout/Grid'
import getFarmConfig from 'utils/getFarmConfig'
import { FarmCard, FarmCardOffline } from './FarmCard'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}

interface FarmCardsProps {
  removed: boolean
}

const FarmCards: React.FC<FarmCardsProps> = ({ removed }) => {
  const farms = useFarms()
  const stakedValue = useAllStakedValue()
  const bnbPrice = useBnbPriceUSD()

  const stakedValueById = stakedValue.reduce((accum, value) => {
    return {
      ...accum,
      [value.pid]: value,
    }
  }, {})

  const cakePrice = stakedValueById[CAKE_POOL_PID] ? stakedValueById[CAKE_POOL_PID].tokenPrice : new BigNumber(0)

  const realFarms = !removed
    ? farms.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
    : farms.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')

  // temp fix
  const staxBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x7cd05f8b960ba071fdf69c750c0e5a57c8366500',
  )
  const narBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x745c4fd226e169d6da959283275a8e0ecdd7f312',
  )
  const nyaBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x2730bf486d658838464a4ef077880998d944252d',
  )
  const bROOBEEBalance = useTokenBalance2(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    '0x970858016C963b780E06f7DCfdEf8e809919BcE8',
  )

  const rows = realFarms.reduce<FarmWithStakedValue[][]>((accum, farm) => {
    const stakedValueItem = stakedValueById[farm.pid]

    const cakeRewardPerBlock = stakedValueItem && CAKE_PER_BLOCK.times(stakedValueItem.poolWeight)

    const calculateCommunityApy = (balance: BigNumber) => {
      if (!stakedValueItem) {
        return null
      }

      return cakeRewardPerBlock.times(BLOCKS_PER_YEAR).div(balance).div(2)
    }

    let apy

    if (farm.pid === 11 || farm.pid === 41) {
      apy = stakedValueItem
        ? cakePrice
            .times(cakeRewardPerBlock)
            .times(BLOCKS_PER_YEAR)
            .div(stakedValueItem.tokenAmount)
            .div(2)
            .times(bnbPrice)
        : null
    } else if (farm.tokenSymbol === 'STAX') {
      apy = calculateCommunityApy(staxBalance)
    } else if (farm.tokenSymbol === 'NAR') {
      apy = calculateCommunityApy(narBalance)
    } else if (farm.tokenSymbol === 'NYA') {
      apy = calculateCommunityApy(nyaBalance)
    } else if (farm.tokenSymbol === 'bROOBEE') {
      apy = calculateCommunityApy(bROOBEEBalance)
    } else if (farm.tokenSymbol === 'HARD' || farm.tokenSymbol === 'UNFI') {
      const config = getFarmConfig(farm.pid)

      // TODO: Refactor APY for dual farm
      const cakeApy =
        stakedValueItem &&
        cakePrice.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(stakedValueItem.totalWethValue)
      const hardApy =
        stakedValueItem &&
        stakedValueItem.tokenPrice
          .times(config?.dual?.rewardPerBlock)
          .times(BLOCKS_PER_YEAR)
          .div(stakedValueItem.totalWethValue)

      apy = cakeApy && hardApy && cakeApy.plus(hardApy)
    } else {
      apy =
        stakedValueItem && !removed
          ? cakePrice.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(stakedValueItem.totalWethValue)
          : null
    }

    return [
      ...accum,
      {
        ...farm,
        ...stakedValueItem,
        apy,
      },
    ]
  }, [])

  return (
    <Page>
      <Grid>
        {rows.length > 0
          ? rows.map((farm) => (
              <FarmCard farm={farm} stakedValue={stakedValueById[farm.tokenSymbol]} removed={removed} />
            ))
          : farmsConfig.filter((f) => f.pid !== 0).map((pool) => <FarmCardOffline pool={pool} />)}
      </Grid>
    </Page>
  )
}

export default FarmCards
