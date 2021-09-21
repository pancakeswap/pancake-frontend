import React from 'react'
import styled from 'styled-components'
import { Box, Button, Heading } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
<<<<<<< HEAD
import PageHeader from 'components/PageHeader'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import Collections from './Collections'
=======
import { useGetCollections } from 'state/nftMarket/hooks'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { HotCollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'
>>>>>>> 82a113a4 (refactor: Reorganize collection heirarchy)
import Newest from './Newest'
import config from './config'

const Gradient = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
`

const Home = () => {
  const { t } = useTranslation()

  return (
<<<<<<< HEAD
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('NFT Market')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Buy and Sell verified PancakeSwap collectibles.')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('PancakeSwap NFTs only... for now!')}
        </Heading>
        <Button as={Link} to={`${nftsBaseUrl}/profile`} mt="32px">
          {t('Manage/Sell')}
        </Button>
      </PageHeader>
      <Page>
        <Collections />
        <Newest />
      </Page>
      <Gradient p="64px 0">
        <SectionsWithFoldableText header="FAQs" config={config} m="auto" />
      </Gradient>
    </>
=======
    <Page>
      <Link to={`${nftsBaseUrl}/profile`}>Profile</Link>
      <br />
      <Link to={`${nftsBaseUrl}/buy-sell-demo`}>Buy and Sell demo</Link>
      <br />
      <Box mb="40px">
        <Link to={`${nftsBaseUrl}/item/7`}>Individual NFT page</Link>
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
                url={`${nftsBaseUrl}/collections/${collectionAddress}`}
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
>>>>>>> 82a113a4 (refactor: Reorganize collection heirarchy)
  )
}

export default Home
