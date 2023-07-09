import { useTranslation } from '@pancakeswap/localization'
import {
  Flex,
  FlexLayout,
  Heading,
  PageHeader,
  Pool,
  ToggleView,
  ViewMode,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useState } from 'react'
import { useCurrenDay, useStakedPools, useStakedPositionsByUser } from './hooks/useStakedPools'
import { FixedStakingCard } from './components/FixedStakingCard'
import FixedStakingRow from './components/FixedStakingRow'

enum POOL_STATUS {
  Finished = 1,
  Live = 0,
}

const FixedStaking = () => {
  const { t } = useTranslation()

  const [viewMode, setViewMode] = useState(ViewMode.TABLE)

  const [poolStatus, togglePoolStatus] = useState(POOL_STATUS.Live)

  const stakingPools = useStakedPools()

  const stakedPositions = useStakedPositionsByUser()
  const currentDate = useCurrenDay()

  const displayPools =
    poolStatus === POOL_STATUS.Live
      ? stakingPools.filter((pool) => pool.endDay > currentDate)
      : stakingPools.filter((pool) => pool.endDay <= currentDate)

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
        <Flex mb="24px">
          <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
          <Flex>
            <ButtonMenu activeIndex={poolStatus} scale="sm" variant="subtle" onItemClick={togglePoolStatus}>
              <ButtonMenuItem>{t('Live')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
            </ButtonMenu>
          </Flex>
        </Flex>
        {viewMode === ViewMode.TABLE ? (
          <Pool.PoolsTable>
            {displayPools.map(
              (pool) =>
                pool && (
                  <FixedStakingRow
                    stakedPositions={stakedPositions.filter(
                      ({ pool: stakedPool }) => stakedPool.token.address === pool.token.address,
                    )}
                    pool={pool}
                  />
                ),
            )}
          </Pool.PoolsTable>
        ) : (
          <FlexLayout>
            {displayPools.map(
              (pool) =>
                pool?.token && (
                  <FixedStakingCard
                    pool={pool}
                    stakedPositions={stakedPositions.filter(
                      ({ pool: stakedPool }) => stakedPool.token.address === pool.token.address,
                    )}
                  />
                ),
            )}
          </FlexLayout>
        )}
      </Page>
    </>
  )
}

export default FixedStaking
