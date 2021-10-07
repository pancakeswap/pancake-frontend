import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Box, Flex, Grid, Text } from '@pancakeswap/uikit'
import { NftToken, TokenMarketData } from 'state/nftMarket/types'
import { useGetCollection } from 'state/nftMarket/hooks'
import { getNftApi, getNftsMarketData } from 'state/nftMarket/helpers'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Select, { OptionProps } from 'components/Select/Select'
import Header from './Header'
import GridPlaceholder from '../components/GridPlaceholder'
import { CollectibleLinkCard } from '../components/CollectibleCard'

const OnSale = () => {
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const [nfts, setNfts] = useState<NftToken[]>([])
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc')
  const { t } = useTranslation()
  const collection = useGetCollection(collectionAddress)

  const sortByItems = [
    { label: t('Lowest price'), value: 'asc' },
    { label: t('Highest price'), value: 'desc' },
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
      setNfts(responsesWithMarketData)
    }

    const fetchMarketData = async () => {
      const subgraphRes = await getNftsMarketData(
        { collection: collectionAddress.toLowerCase(), isTradable: true },
        100,
        'currentAskPrice',
        sortBy,
      )
      fetchApiData(subgraphRes)
    }

    fetchMarketData()
  }, [collectionAddress, sortBy])

  const handleChange = (event: OptionProps) => {
    setNfts([])
    setSortBy(event.value)
  }

  return (
    <>
      <Header collection={collection} />
      <Page>
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
        )}
      </Page>
    </>
  )
}

export default OnSale
