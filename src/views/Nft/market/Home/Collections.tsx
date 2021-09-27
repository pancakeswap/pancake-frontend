import React from 'react'
import { Button, ChevronRightIcon, Flex, Grid, Heading, Text } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useGetCollections } from 'state/nftMarket/hooks'
import { nftsBaseUrl, TMP_SEE_ALL_LINK } from 'views/Nft/market/constants'
import { useTranslation } from 'contexts/Localization'
import { HotCollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'

const Collections = () => {
  const { t } = useTranslation()
  const collections = useGetCollections()

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="32px">
        <Heading as="h3" scale="lg">
          {t('Hot Collections')}
        </Heading>
        <Button
          as={Link}
          to={TMP_SEE_ALL_LINK}
          variant="secondary"
          scale="sm"
          endIcon={<ChevronRightIcon color="primary" width="24px" />}
        >
          {t('View All')}
        </Button>
      </Flex>
      <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
        {Object.keys(collections)
          .slice(0, 2)
          .map((collectionAddress) => {
            const collection = collections[collectionAddress]
            return (
              <HotCollectionCard
                key={collectionAddress}
                bgSrc={collection.banner.small}
                avatarSrc={collection.avatar}
                collectionName={collection.name}
                url={`${nftsBaseUrl}/collections/${collectionAddress}`}
              >
                <Flex alignItems="center">
                  <Text fontSize="12px" color="textSubtle">
                    {t('Volume')}
                  </Text>
                  <BNBAmountLabel amount={parseFloat(collection.totalVolumeBNB)} />
                </Flex>
              </HotCollectionCard>
            )
          })}
        {/* Remove when squad is added to collections API */}
        <HotCollectionCard
          disabled
          bgSrc="/images/collections/pancake-squad-banner-sm.png"
          avatarSrc="/images/collections/pancake-squad-avatar.png"
          collectionName="Pancake Squad"
        >
          <Text color="textDisabled" fontSize="12px">
            {t('Coming Soon')}
          </Text>
        </HotCollectionCard>
        <HotCollectionCard
          disabled
          bgSrc="/images/collections/no-collection-banner-sm.png"
          collectionName="Coming Soon"
        >
          <Text color="textDisabled" fontSize="12px">
            {t('More Collections are on their way!')}
          </Text>
        </HotCollectionCard>
      </Grid>
    </>
  )
}

export default Collections
