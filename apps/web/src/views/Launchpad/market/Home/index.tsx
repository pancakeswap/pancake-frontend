import styled from 'styled-components'
import { Box, Button, Flex, Heading, LinkExternal, PageHeader, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { useGetCollections } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import PageLoader from 'components/Loader/PageLoader'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import SearchBar from '../components/SearchBar'
import Project from './Project'
import config from './config'

const Gradient = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
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
              {t('Launchpad')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('IDO on BNB Testnet')}
            </Heading>
            {account && (
              <Button as={NextLinkFromReactRouter} to={`/profile/${account.toLowerCase()}`} mt="32px">
                {t('Claim NFT join IDO Whitelist')}
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
          <Project
            key="newest-collections"
            title={t('Projects')}
            testId="nfts-newest-collections"
            collections={newestCollections}
          />
        </PageSection>
      )}
    </>
  )
}

export default Home
