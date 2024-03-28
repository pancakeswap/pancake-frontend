import { Button, ChevronRightIcon, Flex, Grid, Heading } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useEffect, useState } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { getLatestListedNfts, getNftsFromDifferentCollectionsApi } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'
import { nftsBaseUrl, pancakeBunniesAddress } from 'views/Nft/market/constants'
import { CollectibleLinkCard } from '../components/CollectibleCard'
import GridPlaceholder from '../components/GridPlaceholder'

/**
 * Fetch latest NFTs data from SG+API and combine them
 * @returns Array of NftToken
 */
const useNewestNfts = () => {
  const [newestNfts, setNewestNfts] = useState<NftToken[] | null>(null)

  useEffect(() => {
    const fetchNewestNfts = async () => {
      const nftsFromSg = await getLatestListedNfts(16)
      const nftsFromApi = await getNftsFromDifferentCollectionsApi(
        nftsFromSg.map((nft) => ({ collectionAddress: nft.collection.id as Address, tokenId: nft.tokenId })),
      )

      const nfts = nftsFromSg
        .map((nftFromSg) => {
          const foundNftFromApi = nftsFromApi.find((nftFromApi) => nftFromApi.tokenId === nftFromSg.tokenId)
          if (foundNftFromApi) {
            return { ...foundNftFromApi, marketData: nftFromSg }
          }
          return null
        })
        .filter(Boolean)
      setNewestNfts(nfts as NftToken[])
    }
    fetchNewestNfts()
  }, [])

  return newestNfts
}

const Newest: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const nfts = useNewestNfts()

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb="26px">
        <Heading data-test="nfts-newest">{t('Newest Arrivals')}</Heading>
        <Button
          as={NextLinkFromReactRouter}
          to={`${nftsBaseUrl}/activity/`}
          variant="secondary"
          scale="sm"
          endIcon={<ChevronRightIcon color="primary" />}
        >
          {t('View All')}
        </Button>
      </Flex>
      {nfts ? (
        <Grid
          gridRowGap="24px"
          gridColumnGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
        >
          {nfts.map((nft) => {
            const isPBCollection = safeGetAddress(nft.collectionAddress) === safeGetAddress(pancakeBunniesAddress)
            const currentAskPrice =
              !isPBCollection && nft.marketData?.isTradable ? parseFloat(nft.marketData?.currentAskPrice) : undefined
            return (
              <CollectibleLinkCard
                data-test="newest-nft-card"
                key={nft.collectionAddress + nft.tokenId}
                nft={nft}
                currentAskPrice={currentAskPrice}
              />
            )
          })}
        </Grid>
      ) : (
        <GridPlaceholder numItems={8} />
      )}
    </>
  )
}

export default Newest
