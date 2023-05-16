import { useTranslation } from '@pancakeswap/localization'
import { Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useInfoUserSavedTokensAndPools from 'hooks/useInfoUserSavedTokensAndPoolsList'
import { useMemo } from 'react'
import { useChainIdByQuery, usePoolDatasSWR } from 'state/info/hooks'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { usePoolsData } from '../hooks/usePoolsData'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { poolsData, stableSwapsAprs } = usePoolsData()
  const chainId = useChainIdByQuery()
  const { savedPools } = useInfoUserSavedTokensAndPools(chainId)
  const watchlistPools = usePoolDatasSWR(savedPools)
  const watchlistPoolsData = useMemo(
    () =>
      watchlistPools.map((pool) => {
        return { ...pool, ...(stableSwapsAprs && { lpApr7d: stableSwapsAprs[pool.address] }) }
      }),
    [watchlistPools, stableSwapsAprs],
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
      <PoolTable poolDatas={poolsData} />
    </Page>
  )
}

export default PoolsOverview
