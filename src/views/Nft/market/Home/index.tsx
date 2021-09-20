import React from 'react'
import { Box, Button, ChevronRightIcon, Flex, Grid, Heading, Text } from '@pancakeswap/uikit'
import { Link, useRouteMatch } from 'react-router-dom'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import { useGetCollections } from 'state/nftMarket/hooks'
import { HotCollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'
import Newest from './Newest'

const Home = () => {
  const { t } = useTranslation()
  const collections = useGetCollections()
  const { url } = useRouteMatch()

  return (
    <>
      <Page>
        <Link to="/nfts/collectibles">Collectibles</Link>
        <br />
        <Link to="/nfts/profile">Profile</Link>
        <br />
        <Link to="/nfts/buy-sell-demo">Buy and Sell demo</Link>
        <br />
        <Box mb="40px">
          <Link to="/nfts/item/7">Individual NFT page</Link>
        </Box>
        <Flex alignItems="center" justifyContent="space-between" mb="32px">
          <Heading as="h3" scale="lg">
            {t('Hot Collections')}
          </Heading>
          <Button variant="secondary" scale="sm" endIcon={<ChevronRightIcon color="primary" width="24px" />}>
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
                  url={`${url}/collections/${collectionAddress}`}
                >
                  <Flex alignItems="center">
                    <Text fontSize="12px" color="textSubtle">
                      {t('Volume')}
                    </Text>
                    <BNBAmountLabel amount={ethers.BigNumber.from(collection.totalVolumeBNB).toNumber()} />
                  </Flex>
                </HotCollectionCard>
              )
            })}
          <HotCollectionCard
            bgSrc="/images/collections/no-collection-banner-sm.png"
            collectionName="Coming Soon"
            url={url}
          >
            <Text fontSize="12px" color="textSubtle">
              {t('More Collections are on their way!')}
            </Text>
          </HotCollectionCard>
        </Grid>
        <Newest />
      </Page>
    </>
  )
}

export default Home
