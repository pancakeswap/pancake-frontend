import { useTranslation } from '@pancakeswap/localization'
import { Flex, FlexLayout, Heading, PageHeader } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import min from 'lodash/min'
import max from 'lodash/max'
import BigNumber from 'bignumber.js'

import { useStakedPools, useStakedPositionsByUser } from './hooks/useStakedPools'
import { FixedStakingCard } from './components/FixedStakingCard'
// import FixedStakingRow from './components/FixedStakingRow'
import { FixedStakingPool } from './type'

const FixedStaking = () => {
  const { t } = useTranslation()

  // const [viewMode, setViewMode] = useState(ViewMode.TABLE)

  // const [poolStatus, togglePoolStatus] = useState(POOL_STATUS.Live)

  const displayPools = useStakedPools()

  const stakedPositions = useStakedPositionsByUser(displayPools.map((p) => p.poolIndex))

  // Groupd pools with same token
  const groupPoolsByToken = useMemo<Record<string, FixedStakingPool[]>>(() => {
    return displayPools.reduce((pools, pool) => {
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

      const minLockDayPercent = min(pools.map((p) => p.lockDayPercent))
      const maxLockDayPercent = max(pools.map((p) => p.lockDayPercent))

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

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Fixed Staking')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Single-Sided Simple Earn Staking')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page title={t('Pools')}>
        <FlexLayout>
          {Object.keys(poolGroup).map((key) => (
            <FixedStakingCard
              pool={poolGroup[key]}
              stakedPositions={stakedPositions.filter(
                ({ pool: stakedPool }) => stakedPool.token.address === poolGroup[key].token.address,
              )}
            />
          ))}
        </FlexLayout>
      </Page>
    </>
  )
}

export default FixedStaking
