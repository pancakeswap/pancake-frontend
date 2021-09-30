import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { useWeb3React } from '@web3-react/core'
import { Flex } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import Page from 'components/Layout/Page'
import { useFetchByBunnyId, useGetAllBunniesByBunnyId, useUpdateNftInfo } from 'state/nftMarket/hooks'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import PageLoader from 'components/Loader/PageLoader'
import usePreviousValue from 'hooks/usePreviousValue'
import useRefresh from 'hooks/useRefresh'
import MainNFTCard from './MainNFTCard'
import ManageCard from './ManageCard'
import PropertiesCard from './PropertiesCard'
import DetailsCard from './DetailsCard'
import MoreFromThisCollection from './MoreFromThisCollection'
import ForSaleTableCard from './ForSaleTableCard'
import { pancakeBunniesAddress } from '../../constants'
import { sortNFTsByPriceBuilder } from './ForSaleTableCard/utils'
import { SortType } from '../../types'

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
  const [nothingForSaleBunny, setNothingForSaleBunny] = useState<NftToken>(null)
  const allBunnies = useGetAllBunniesByBunnyId(tokenId)
  const [priceSort, setPriceSort] = useState<SortType>('asc')
  const previousPriceSort = usePreviousValue(priceSort)
  const { isFetchingMoreNfts, latestFetchAt, fetchMorePancakeBunnies } = useFetchByBunnyId(tokenId)
  const { fastRefresh } = useRefresh()
  const bunniesSortedByPrice = orderBy(allBunnies, (nft) => parseFloat(nft.marketData.currentAskPrice))
  const allBunniesFromOtherSellers = account
    ? bunniesSortedByPrice.filter((bunny) => bunny.marketData.currentSeller !== account.toLowerCase())
    : bunniesSortedByPrice
  const cheapestBunny = bunniesSortedByPrice[0]
  const cheapestBunnyFromOtherSellers = allBunniesFromOtherSellers[0]

  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  useUpdateNftInfo(collectionAddress)

  useEffect(() => {
    // Fetch first 30 NFTs on page load
    // And then query every 10 sec in case some new (cheaper) NFTs were listed
    const msSinceLastUpdate = Date.now() - latestFetchAt
    // Check for last update is here to prevent too many request due to fetchMorePancakeBunnies updating too often
    // (it can't be reasonably wrapper in useCallback because the tokens are updated every time you call it, which is the whole point)
    if (msSinceLastUpdate > 10000 && !isFetchingMoreNfts) {
      fetchMorePancakeBunnies(priceSort)
    }
  }, [priceSort, fetchMorePancakeBunnies, isFetchingMoreNfts, latestFetchAt, fastRefresh])

  useEffect(() => {
    const fetchTokens = async () => {
      const apiResponse = await getNftsFromCollectionApi(collectionAddress)
      setAttributesDistribution(apiResponse.attributesDistribution)
    }

    fetchTokens()
  }, [collectionAddress, setAttributesDistribution])

  useEffect(() => {
    // Fetch most expensive items if user selects other sorting
    if (previousPriceSort && previousPriceSort !== priceSort) {
      fetchMorePancakeBunnies(priceSort)
    }
  }, [fetchMorePancakeBunnies, priceSort, previousPriceSort])

  useEffect(() => {
    const fetchBasicBunnyData = async () => {
      const { data } = await getNftsFromCollectionApi(pancakeBunniesAddress)
      setNothingForSaleBunny({
        // In this case tokenId doesn't matter, this token can't be bought
        tokenId: data[tokenId].name,
        name: data[tokenId].name,
        description: data[tokenId].description,
        collectionName: data[tokenId].collection.name,
        collectionAddress: pancakeBunniesAddress,
        image: data[tokenId].image,
        attributes: [
          {
            traitType: 'bunnyId',
            value: tokenId,
            displayType: null,
          },
        ],
      })
    }
    // If bunny id has no listings on the market - get basic bunny info
    if (isPBCollection && !cheapestBunny) {
      fetchBasicBunnyData()
    }
  }, [cheapestBunny, tokenId, isPBCollection])

  const sortedNfts = useMemo(() => allBunnies.sort(sortNFTsByPriceBuilder({ priceSort })), [allBunnies, priceSort])

  if (!cheapestBunny && !nothingForSaleBunny) {
    // TODO redirect to nft market page if collection or bunny id does not exist (came here from some bad url)
    // That would require tracking loading states and stuff...

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  const togglePriceSort = () => {
    setPriceSort((currentValue) => (currentValue === 'asc' ? 'desc' : 'asc'))
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

  const properties = isPBCollection ? cheapestBunny?.attributes || nothingForSaleBunny?.attributes : []

  const propertyRarity = isPBCollection ? { bunnyId: getBunnyIdRarity() } : {}

  return (
    <Page>
      <MainNFTCard
        cheapestNft={cheapestBunny}
        cheapestNftFromOtherSellers={cheapestBunnyFromOtherSellers}
        nothingForSaleBunny={nothingForSaleBunny}
      />
      <TwoColumnsContainer flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageCard bunnyId={tokenId} lowestPrice={cheapestBunny?.marketData?.currentAskPrice} />
          <PropertiesCard properties={properties} rarity={propertyRarity} />
          <DetailsCard contractAddress={collectionAddress} ipfsJson={cheapestBunny?.marketData?.metadataUrl} />
        </Flex>
        <ForSaleTableCard
          nftsForSale={sortedNfts}
          bunnyId={tokenId}
          totalForSale={allBunnies.length}
          loadMore={fetchMorePancakeBunnies}
          priceSort={priceSort}
          togglePriceSort={togglePriceSort}
          isFetchingMoreNfts={isFetchingMoreNfts}
        />
      </TwoColumnsContainer>
      <MoreFromThisCollection
        collectionAddress={collectionAddress}
        currentTokenName={cheapestBunny?.name || nothingForSaleBunny?.name}
      />
    </Page>
  )
}

export default IndividualNFTPage
