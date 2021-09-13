import React from 'react'
import { Box, Button, ChevronRightIcon, Flex, Grid, Heading, Text } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import { HotCollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <Page>
        <Link to="/nft/market/collectibles">Collectibles</Link>
        <br />
        <Link to="/nft/market/profile">Profile</Link>
        <br />
        <Box mb="40px">
          <Link to="/nft/market/item/7">Individual NFT page</Link>
        </Box>
        <Flex alignItems="center" justifyContent="space-between" mb="32px">
          <Heading as="h3" scale="lg">
            {t('Hot Collections')}
          </Heading>
          <Button variant="secondary" scale="sm" endIcon={<ChevronRightIcon color="primary" width="24px" />}>
            {t('View All')}
          </Button>
        </Flex>
        <Grid gridGap="16px" gridTemplateColumns="repeat(3, 1fr)">
          <HotCollectionCard
            bgSrc="/images/collections/pancake-bunnies-banner-sm.png"
            avatarSrc="/images/collections/pancake-bunnies-avatar.png"
            collectionName="Pancake Bunnies"
          >
            <Flex alignItems="center">
              <Text fontSize="12px" color="textSubtle">
                {t('Volume')}
              </Text>
              <BNBAmountLabel amount={255.66} />
            </Flex>
          </HotCollectionCard>
          <HotCollectionCard
            bgSrc="/images/collections/pancake-squad-banner-sm.png"
            avatarSrc="/images/collections/pancake-squad-avatar.png"
            collectionName="Pancake Squad"
          >
            <Flex alignItems="center">
              <Text fontSize="12px" color="textSubtle">
                {t('Volume')}
              </Text>
              <BNBAmountLabel amount={43000.02} />
            </Flex>
          </HotCollectionCard>
          <HotCollectionCard bgSrc="/images/collections/no-collection-banner-sm.png" collectionName="Coming Soon">
            <Text fontSize="12px" color="textSubtle">
              {t('More Collections are on their way!')}
            </Text>
          </HotCollectionCard>
        </Grid>
      </Page>
    </>
  )
}

export default Home
