import React from 'react'
import styled from 'styled-components'
import { Box, Button, Heading } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import Collections from './Collections'
import Newest from './Newest'
import config from './config'

const Gradient = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
`

const Home = () => {
  const { t } = useTranslation()

  return (
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
  )
}

export default Home
