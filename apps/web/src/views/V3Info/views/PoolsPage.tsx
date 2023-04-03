import { useTranslation } from '@pancakeswap/localization'
import { Heading } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import PoolTable from '../components/PoolTable'

import { useTopPoolsData } from '../hooks'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const topPoolsData = useTopPoolsData()

  const poolsData = useMemo(() => {
    if (topPoolsData) {
      return Object.values(topPoolsData)
    }
    return []
  }, [topPoolsData])

  // const [savedPools] = useWatchlistPools()
  // const watchlistPools = usePoolDatasSWR(savedPools)

  return (
    <Page>
      {/* <Heading scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      <Card style={{ display: 'none' }}>
        {watchListPoolsData.length > 0 ? (
          <PoolTable poolDatas={watchListPoolsData} />
        ) : (
          <Text px="24px" py="16px">
            {t('Saved pairs will appear here')}
          </Text>
        )}
      </Card> */}
      <Heading scale="lg" mt="40px" mb="16px" id="info-pools-title">
        {t('All Pairs')}
      </Heading>
      <PoolTable poolDatas={poolsData} />
    </Page>
  )
}

export default PoolsOverview
