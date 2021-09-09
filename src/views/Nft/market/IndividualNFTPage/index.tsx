import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import MainNFTCard from './MainNFTCard'
import ManageCard from './ManageCard'
import PropertiesCard from './PropertiesCard'
import DetailsCard from './DetailsCard'
import MoreFromThisCollection from './MoreFromThisCollection'
import ForSaleTableCard from './ForSaleTableCard'
import { twinkleForSale, userCollectibles, collectiblesForSale } from './tmp'

const TwoColumnsContainer = styled(Flex)`
  gap: 22px;
  align-items: flex-start;
  & > div:first-child {
    flex: 1;
    gap: 20px;
  }
  & > div:last-child {
    flex: 2;
  }
`

const IndividualNFTPage = () => {
  return (
    <Page>
      <MainNFTCard collectible={twinkleForSale} />
      <TwoColumnsContainer flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageCard userCollectibles={userCollectibles} />
          <PropertiesCard collectible={twinkleForSale} />
          <DetailsCard collectible={twinkleForSale} />
        </Flex>
        <ForSaleTableCard collectiblesForSale={collectiblesForSale} totalForSale={450} />
      </TwoColumnsContainer>
      <MoreFromThisCollection />
    </Page>
  )
}

export default IndividualNFTPage
