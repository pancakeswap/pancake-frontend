import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading, PageHeader } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import dynamic from 'next/dynamic'
import { Collection } from 'state/nftMarket/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'

const CollectionCardWithVolume = dynamic(
  () => import('../../Nft/market/components/CollectibleCard/CollectionCardWithVolume'),
  { ssr: false },
)

const PancakeCollectibles = () => {
  const { t } = useTranslation()
  const { data: collections, status } = useQuery<Collection[]>({
    queryKey: ['pancakeCollectibles'],
    enabled: false,
  })

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" data-test="nft-collections-title">
          {t('Pancake Collectibles')}
        </Heading>
      </PageHeader>
      <Page>
        {status !== 'success' ? (
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
