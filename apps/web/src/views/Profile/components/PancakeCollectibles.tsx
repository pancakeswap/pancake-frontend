import { Grid, Heading, PageHeader } from '@pancakeswap/uikit'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { Collection } from 'state/nftMarket/types'
import Page from 'components/Layout/Page'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import PageLoader from 'components/Loader/PageLoader'

const CollectionCardWithVolume = dynamic(
  () => import('../../Nft/market/components/CollectibleCard/CollectionCardWithVolume'),
  { ssr: false },
)

const PancakeCollectibles = () => {
  const { t } = useTranslation()
  const { data: collections, status } = useSWR<Collection[]>(['pancakeCollectibles'])

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" data-test="nft-collections-title">
          {t('Pancake Collectibles')}
        </Heading>
      </PageHeader>
      <Page>
        {status !== FetchStatus.Fetched ? (
          <PageLoader />
        ) : (
          <>
            <Grid
              gridGap="16px"
              gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
              mb="32px"
              data-test="nft-collection-row"
            >
              {collections.map((collection) => {
                return (
                  <CollectionCardWithVolume
                    key={collection.address}
                    bgSrc={collection.banner.small}
                    avatarSrc={collection.avatar}
                    collectionName={collection.name}
                    url={`${nftsBaseUrl}/collections/${collection.address}`}
                    volume={collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0}
                  />
                )
              })}
            </Grid>
          </>
        )}
      </Page>
    </>
  )
}

export default PancakeCollectibles
