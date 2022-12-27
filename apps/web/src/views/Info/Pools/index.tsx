import { useTranslation } from '@pancakeswap/localization'
import { Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import { useAllPoolDataSWR, usePoolDatasSWR, useStableSwapTopPoolsAPR } from 'state/info/hooks'
import { checkIsStableSwap } from 'state/info/constant'
import { useWatchlistPools } from 'state/user/hooks'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const isStableSwap = checkIsStableSwap()
  // get all the pool datas that exist
  const allPoolData = useAllPoolDataSWR()

  const poolAddresses = useMemo(() => {
    return Object.keys(allPoolData)
  }, [allPoolData])

  const stableSwapsAprs = useStableSwapTopPoolsAPR(poolAddresses)

  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool, index) => {
        return {
          ...pool.data,
          ...(isStableSwap && stableSwapsAprs && { lpApr7d: stableSwapsAprs[pool.data.address] }),
        }
      })
      .filter((pool) => pool.token1.name !== 'unknown' && pool.token0.name !== 'unknown')
  }, [allPoolData, isStableSwap, stableSwapsAprs])

  const [savedPools] = useWatchlistPools()
  const watchlistPools = usePoolDatasSWR(savedPools)
  const watchlistPoolsData = useMemo(
    () =>
      watchlistPools.map((pool) => {
        return { ...pool, ...(isStableSwap && stableSwapsAprs && { lpApr7d: stableSwapsAprs[pool.address] }) }
      }),
    [watchlistPools, stableSwapsAprs, isStableSwap],
  )

  return (
    <Page>
      <Heading scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      <Card>
        {watchlistPools.length > 0 ? (
          <PoolTable poolDatas={watchlistPoolsData} />
        ) : (
          <Text px="24px" py="16px">
            {t('Saved pairs will appear here')}
          </Text>
        )}
      </Card>
      <Heading scale="lg" mt="40px" mb="16px" id="info-pools-title">
        {t('All Pairs')}
      </Heading>
      <PoolTable poolDatas={poolDatas} />
    </Page>
  )
}

export default PoolsOverview
