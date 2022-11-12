import { useTranslation } from '@pancakeswap/localization'
import { Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import { useAllPoolDataSWR, usePoolDatasSWR } from 'state/info/hooks'
import { useWatchlistPools } from 'state/user/hooks'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  // get all the pool datas that exist
  const allPoolData = useAllPoolDataSWR()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)
  }, [allPoolData])

  const [savedPools] = useWatchlistPools()
  const watchlistPools = usePoolDatasSWR(savedPools)

  return (
    <Page>
      <Heading scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      <Card>
        {watchlistPools.length > 0 ? (
          <PoolTable poolDatas={watchlistPools} />
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
