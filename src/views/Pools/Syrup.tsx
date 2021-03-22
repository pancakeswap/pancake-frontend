import React, { useState, useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Heading, Button, Flex, Text, HelpIcon, Input, useMatchBreakpoints } from '@pancakeswap-libs/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import { usePools, useBlock, useGetApiPrices } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import Select, { OptionProps } from 'views/Farms/components/Select/Select'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApy } from 'utils/apy'
import { Pool } from 'state/types'

import Coming from './components/Coming'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import Divider from './components/Divider'

const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const prices = useGetApiPrices()

  const { blockNumber } = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const [sortOption, setSortOption] = useState('hot')

  const sortPools = (pools: Pool[]): Pool[] => {
    switch (sortOption) {
      case 'apr':
        return orderBy(pools, (pool: Pool) => new BigNumber(pool.apr || 0), 'desc')
      case 'earned':
        return orderBy(pools, (pool: Pool) => new BigNumber(pool.userData?.pendingReward || 0), 'desc')
      case 'total_staked':
        return orderBy(pools, (pool: Pool) => new BigNumber(pool.totalStaked || 0).toNumber(), 'desc')
      case 'finish':
        return orderBy(pools, 'isFinished', 'desc')
      default:
        return pools
    }
  }

  let pools = usePools(account).map((pool) => {
    const { earningToken, stakingToken } = pool
    const stakingTokenPrice = prices ? prices[stakingToken.symbol.toLowerCase()] : null
    const rewardTokenPrice = prices ? prices[earningToken.symbol.toLowerCase()] : null

    const apr = getPoolApy(
      stakingTokenPrice,
      rewardTokenPrice,
      getBalanceNumber(pool.totalStaked, stakingToken.decimals),
      parseFloat(pool.tokenPerBlock),
    )

    if (apr) {
      return { ...pool, apr }
    }

    return pool
  })

  pools = sortPools(pools)

  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || blockNumber > pool.endBlock),
    [blockNumber, pools],
  )
  const stackedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
      <Hero>
        <HeroInner>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading as="h1" size="xxl" mb="16px" fontSize="64px" color="secondary">
              {TranslateString(738, 'Syrup Pool')}
            </Heading>
            <Button variant="subtle" ml="auto" as="a">
              {isXl && 'Help'}
              <HelpIcon color="white" ml="4px" />
            </Button>
          </Flex>
          <Text fontSize="20px" bold>
            {TranslateString(999, 'Simply stake tokens to earn.')}
          </Text>
          <Text fontSize="20px" bold>
            {TranslateString(999, 'High APR, low risk.')}
          </Text>
        </HeroInner>
      </Hero>
      <Page>
        <ControlContainer justifyContent="space-between" alignItems="center" mb="32px">
          <PoolTabButtons stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} />
          <Flex alignItems="center">
            <Select
              options={[
                {
                  label: 'Hot',
                  value: 'hot',
                },
                {
                  label: 'APR',
                  value: 'apr',
                },
                {
                  label: 'Earned',
                  value: 'earned',
                },
                {
                  label: 'Total Staked',
                  value: 'total_staked',
                },
                {
                  label: 'Finish',
                  value: 'finish',
                },
              ]}
              onChange={handleSortOptionChange}
            />
            <StyledInput placeholder="Search pools" />
          </Flex>
        </ControlContainer>

        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              {stackedOnly
                ? stackedOnlyPools.map((pool) => <PoolCard key={pool.sousId} pool={pool} />)
                : openPools.map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
              <Coming />
            </>
          </Route>
          <Route path={`${path}/history`}>
            {finishedPools.map((pool) => (
              <PoolCard key={pool.sousId} pool={pool} />
            ))}
          </Route>
        </FlexLayout>
      </Page>
    </>
  )
}

const ControlContainer = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const StyledInput = styled(Input)`
  width: 256px;
  margin-left: 24px;
`

const HeroInner = styled.div`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  padding-left: 16px;
  padding-right: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Hero = styled.div`
  display: block;
  background: linear-gradient(180deg, #ceecf3 0%, #ccdcef 51.04%, #cac2ec 100%);
  padding: 32px 0px;

  h1 {
    font-size: 44px;

    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 64px;
    }
  }

  img {
    height: auto;
    max-width: 100%;
  }
`

export default Farm
