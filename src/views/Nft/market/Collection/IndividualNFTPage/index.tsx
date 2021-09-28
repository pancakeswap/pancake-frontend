import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { useWeb3React } from '@web3-react/core'
import { Flex } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import Page from 'components/Layout/Page'
import { useGetAllBunniesByBunnyId } from 'state/nftMarket/hooks'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import MainNFTCard from './MainNFTCard'
import ManageCard from './ManageCard'
import PropertiesCard from './PropertiesCard'
import DetailsCard from './DetailsCard'
import MoreFromThisCollection from './MoreFromThisCollection'
import ForSaleTableCard from './ForSaleTableCard'
import { pancakeBunniesAddress } from '../../constants'

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
  // For PabncakeBunnies tokenId in url is really bunnyId
  const { account } = useWeb3React()
  const { collectionAddress, tokenId } = useParams<{ collectionAddress: string; tokenId: string }>()
  const [attributesDistribution, setAttributesDistribution] = useState<{ [key: string]: number }>(null)
  const allBunnies = useGetAllBunniesByBunnyId(tokenId)
  const bunniesSortedByPrice = orderBy(allBunnies, (nft) => parseFloat(nft.marketData.currentAskPrice))
  const allBunniesFromOtherSellers = account
    ? bunniesSortedByPrice.filter((bunny) => bunny.marketData.currentSeller !== account.toLowerCase())
    : bunniesSortedByPrice
  const cheapestBunny = bunniesSortedByPrice[0]
  const cheapestBunnyFromOtherSellers = allBunniesFromOtherSellers[0]

  useEffect(() => {
    const fetchTokens = async () => {
      const apiResponse = await getNftsFromCollectionApi(collectionAddress)
      setAttributesDistribution(apiResponse.attributesDistribution)
    }

    fetchTokens()
  }, [collectionAddress, setAttributesDistribution])

  if (allBunnies.length === 0 || !cheapestBunny) {
    // TODO redirect to nft market page if collection or bunny id does not exist
    return null
  }

  const getBunnyIdRarity = () => {
    if (attributesDistribution) {
      const total = Object.values(attributesDistribution).reduce((acc, cur) => {
        return acc + cur
      }, 0)
      return ((attributesDistribution[tokenId] / total) * 100).toFixed(2)
    }
    return null
  }

  const properties =
    collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase() ? cheapestBunny.attributes : []

  const propertyRarity =
    collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase() ? { bunnyId: getBunnyIdRarity() } : {}

  return (
    <Page>
      <MainNFTCard cheapestNft={cheapestBunny} cheapestNftFromOtherSellers={cheapestBunnyFromOtherSellers} />
      <TwoColumnsContainer flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageCard bunnyId={tokenId} lowestPrice={cheapestBunny.marketData.currentAskPrice} />
          <PropertiesCard properties={properties} rarity={propertyRarity} />
          <DetailsCard contractAddress={collectionAddress} ipfsJson={cheapestBunny.marketData.metadataUrl} />
        </Flex>
        <ForSaleTableCard nftsForSale={bunniesSortedByPrice} totalForSale={allBunnies.length} />
      </TwoColumnsContainer>
      <MoreFromThisCollection collectionAddress={collectionAddress} currentTokenName={cheapestBunny.name} />
    </Page>
  )
}

export default IndividualNFTPage
