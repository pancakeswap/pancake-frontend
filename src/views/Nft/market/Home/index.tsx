import styled from 'styled-components'
import { Box, Button, Flex, Heading, LinkExternal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { useGetCollections } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import PageLoader from 'components/Loader/PageLoader'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import SearchBar from '../components/SearchBar'
import Collections from './Collections'
import Newest from './Newest'
import config from './config'

const Gradient = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
`

const StyledPageHeader = styled(PageHeader)`
  margin-bottom: -40px;
  padding-bottom: 40px;
`

const StyledHeaderInner = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  & div:nth-child(1) {
    order: 1;
  }
  & div:nth-child(2) {
    order: 0;
    margin-bottom: 32px;
    align-self: end;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    & div:nth-child(1) {
      order: 0;
    }
    & div:nth-child(2) {
      order: 1;
      margin-bottom: 0;
      align-self: auto;
    }
  }
`

const Home = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { data: collections, status } = useGetCollections()

  const hotCollections = orderBy(
    collections,
    (collection) => (collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0),
    'desc',
  )

  const newestCollections = orderBy(
    collections,
    (collection) => (collection.createdAt ? Date.parse(collection.createdAt) : 0),
    'desc',
  )

  return (
    <>
      <PageMeta />
      <StyledPageHeader>
        <StyledHeaderInner>
          <div>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('NFT Marketplace')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Buy and Sell NFTs on BNB Smart Chain')}
            </Heading>
            {account && (
              <Button as={NextLinkFromReactRouter} to={`/profile/${account.toLowerCase()}`} mt="32px">
                {t('Manage/Sell')}
              </Button>
            )}
          </div>
          <SearchBar />
        </StyledHeaderInner>
      </StyledPageHeader>
      {status !== FetchStatus.Fetched ? (
        <PageLoader />
      ) : (
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background={theme.colors.background}
          index={1}
          concaveDivider
          dividerPosition="top"
        >
          <Collections
            key="newest-collections"
            title={t('Newest Collections')}
            testId="nfts-newest-collections"
            collections={newestCollections}
          />
          <Collections
            key="hot-collections"
            title={t('Hot Collections')}
            testId="nfts-hot-collections"
            collections={hotCollections}
          />
          <Newest />
        </PageSection>
      )}
      <Gradient p="64px 0">
        <SectionsWithFoldableText header={t('FAQs')} config={config(t)} m="auto" />
        <LinkExternal href="https://docs.pancakeswap.finance/contact-us/nft-market-applications" mx="auto" mt="16px">
          {t('Apply to NFT Marketplace!')}
        </LinkExternal>
      </Gradient>
    </>
  )
}

export default Home
