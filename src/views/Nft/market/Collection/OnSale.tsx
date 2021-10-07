import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Box, Flex, Grid, Text, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { uniqBy } from 'lodash'
import { NftToken, TokenMarketData } from 'state/nftMarket/types'
import { useGetCollection } from 'state/nftMarket/hooks'
import { getNftApi, getNftsMarketData } from 'state/nftMarket/helpers'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Select, { OptionProps } from 'components/Select/Select'
import Header from './Header'
import GridPlaceholder from '../components/GridPlaceholder'
import { CollectibleLinkCard } from '../components/CollectibleCard'

const REQUEST_SIZE = 100

interface QueryParams {
  orderDirection: 'asc' | 'desc'
  orderBy: 'currentAskPrice' | 'updatedAt'
}

const OnSale = () => {
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const [nfts, setNfts] = useState<NftToken[]>([])
  const [queryParams, setQueryParams] = useState<QueryParams>({ orderDirection: 'asc', orderBy: 'currentAskPrice' })
  const [isFetching, setIsFetching] = useState(false)
  const [skip, setSkip] = useState(0)
  const { t } = useTranslation()
  const collection = useGetCollection(collectionAddress)
  const { numberTokensListed } = collection

  const sortByItems = [
    { label: t('Lowest price'), value: { orderDirection: 'asc', orderBy: 'currentAskPrice' } },
    { label: t('Highest price'), value: { orderDirection: 'desc', orderBy: 'currentAskPrice' } },
    { label: t('Recently listed'), value: { orderDirection: 'desc', orderBy: 'updatedAt' } },
  ]

  useEffect(() => {
    const fetchApiData = async (marketData: TokenMarketData[]) => {
      const apiRequestPromises = marketData.map((marketNft) => getNftApi(collectionAddress, marketNft.tokenId))
      const apiResponses = await Promise.all(apiRequestPromises)
      const responsesWithMarketData = apiResponses.map((apiNft, i) => {
        return {
          ...apiNft,
          collectionAddress,
          collectionName: apiNft.collection.name,
          marketData: marketData[i],
        }
      })
      setIsFetching(false)
      setNfts((prevState) => {
        const combinedNfts = [...prevState, ...responsesWithMarketData]
        return uniqBy(combinedNfts, 'tokenId')
      })
    }

    const fetchMarketData = async () => {
      const subgraphRes = await getNftsMarketData(
        { collection: collectionAddress.toLowerCase(), isTradable: true },
        REQUEST_SIZE,
        queryParams.orderBy,
        queryParams.orderDirection,
        skip,
      )
      fetchApiData(subgraphRes)
    }

    setIsFetching(true)
    fetchMarketData()
  }, [collectionAddress, queryParams, skip])

  const handleChange = (event: OptionProps) => {
    setNfts([])
    const { value } = event
    setQueryParams({ orderDirection: value.orderDirection, orderBy: value.orderBy })
  }

  const handleLoadMore = () => {
    setSkip(skip + REQUEST_SIZE)
  }

  return (
    <>
      <Header collection={collection} />
      <Page>
        <Box position="relative">
          <Flex alignItems="center" justifyContent={['flex-start', null, null, 'flex-end']} mb="24px">
            <Box minWidth="165px">
              <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
                {t('Sort By')}
              </Text>
              <Select options={sortByItems} onOptionChange={handleChange} />
            </Box>
          </Flex>
          {!nfts.length ? (
            <GridPlaceholder />
          ) : (
            <>
              <Grid
                gridGap="16px"
                gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
                alignItems="start"
              >
                {nfts.map((nft) => {
                  const currentAskPriceAsNumber = nft.marketData?.currentAskPrice
                    ? parseFloat(nft.marketData.currentAskPrice)
                    : 0

                  return (
                    <CollectibleLinkCard
                      key={`${nft.tokenId}-${nft.collectionName}`}
                      nft={nft}
                      currentAskPrice={currentAskPriceAsNumber}
                    />
                  )
                })}
              </Grid>
            </>
          )}

          <Flex mt="60px" mb="12px" justifyContent="center">
            {Number(numberTokensListed) > nfts?.length && (
              <Button
                onClick={handleLoadMore}
                scale="sm"
                endIcon={isFetching ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              >
                {isFetching ? t('Loading') : t('Load more')}
              </Button>
            )}
          </Flex>
        </Box>
      </Page>
    </>
  )
}

export default OnSale
