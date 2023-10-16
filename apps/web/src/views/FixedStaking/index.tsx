import { useTranslation } from '@pancakeswap/localization'
import { Flex, FlexLayout, Heading, PageHeader, ToggleView, ViewMode } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import Page from 'components/Layout/Page'
import { useMemo, useState } from 'react'
import min from 'lodash/min'
import max from 'lodash/max'
import BigNumber from 'bignumber.js'
import { bscTokens } from '@pancakeswap/tokens'
import partition from 'lodash/partition'
import { Address } from 'viem'

import { useStakedPools, useStakedPositionsByUser } from './hooks/useStakedPools'
import { FixedStakingCard } from './components/FixedStakingCard'
import FixedStakingRow from './components/FixedStakingRow'
import { FixedStakingPool } from './type'

const FixedStaking = () => {
  const { t } = useTranslation()

  const [viewMode, setViewMode] = useState(ViewMode.TABLE)

  const displayPools = useStakedPools()

  const displayPoolsIndex = useMemo(() => displayPools.map((p) => p.poolIndex), [displayPools])

  const stakedPositions = useStakedPositionsByUser(displayPoolsIndex)

  // Groupd pools with same token
  const groupPoolsByToken = useMemo<Record<string, FixedStakingPool[]>>(() => {
    return displayPools
      .filter((pool) => pool.token)
      .reduce((pools, pool) => {
        if (Array.isArray(pools[pool.token.address])) {
          pools[pool.token.address].push(pool)

          return pools
        }
        return {
          [pool.token.address]: [pool],
          ...pools,
        }
      }, {})
  }, [displayPools])

  const poolGroup = useMemo(() => {
    return Object.keys(groupPoolsByToken).reduce((poolGroupResult, key) => {
      const pools = groupPoolsByToken[key]

      const minLockDayPercent = min(pools.map((p) => p.lockDayPercent || p.boostDayPercent))
      const maxLockDayPercent = max(pools.map((p) => p.boostDayPercent || p.lockDayPercent))

      const totalDeposited = pools.reduce((sum, p) => sum.plus(p.totalDeposited), new BigNumber(0))

      return {
        [key]: {
          token: pools[0].token,
          minLockDayPercent,
          maxLockDayPercent,
          totalDeposited,
          pools,
        },
        ...poolGroupResult,
      }
    }, {})
  }, [groupPoolsByToken])

  // Put WBNB on top
  const sortedPoolGroup = useMemo(() => {
    const [first, last] = partition(Object.keys(poolGroup), (poolAddress) =>
      [bscTokens.wbnb.address, bscTokens.cake.address].includes(poolAddress as Address),
    )

    return [...first, ...last]
  }, [poolGroup])

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Simple Staking')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Single-Sided Simple Earn Staking')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page title={t('Pools')}>
        <Flex mb="24px">
          <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
        </Flex>
        {viewMode === ViewMode.TABLE ? (
          <Pool.PoolsTable>
            {sortedPoolGroup.map((key) => (
              <FixedStakingRow
                key={key}
                stakedPositions={stakedPositions.filter(
                  ({ pool: stakedPool }) => stakedPool.token.address === poolGroup[key].token.address,
                )}
                pool={poolGroup[key]}
              />
            ))}
          </Pool.PoolsTable>
        ) : (
          <FlexLayout>
            {sortedPoolGroup.map((key) => (
              <FixedStakingCard
                key={key}
                pool={poolGroup[key]}
                stakedPositions={stakedPositions.filter(
                  ({ pool: stakedPool }) => stakedPool.token.address === poolGroup[key].token.address,
                )}
              />
            ))}
          </FlexLayout>
        )}
      </Page>
    </>
  )
}

export default FixedStaking
