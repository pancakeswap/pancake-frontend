import React from 'react'
import styled from 'styled-components'
import { Box, Button, Heading, Flex } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import useTheme from 'hooks/useTheme'
import PancakeSquadBanner from 'views/Home/components/Banners/PancakeSquadBanner'
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

  return (
    <>
      <PageMeta />
      <StyledPageHeader>
        <StyledHeaderInner>
          <div>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('NFT Market')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Buy and Sell verified PancakeSwap collectibles.')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('PancakeSwap NFTs only... for now!')}
            </Heading>
            {account && (
              <Button as={Link} to={`${nftsBaseUrl}/profile/${account.toLowerCase()}`} mt="32px">
                {t('Manage/Sell')}
              </Button>
            )}
          </div>
          <SearchBar />
        </StyledHeaderInner>
      </StyledPageHeader>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={theme.colors.background}
        index={1}
        concaveDivider
        dividerPosition="top"
      >
        <Flex mb="24px">
          <PancakeSquadBanner />
        </Flex>
        <Collections />
        <Newest />
      </PageSection>
      <Gradient p="64px 0">
        <SectionsWithFoldableText header={t('FAQs')} config={config} m="auto" />
      </Gradient>
    </>
  )
}

export default Home
