import React, { useState, useEffect } from 'react'
import { Heading, Flex, Button, Grid, ChevronRightIcon } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { NFT } from 'state/nftMarket/types'
import { getLatestListedNfts, getNftsFromDifferentCollectionsApi } from 'state/nftMarket/helpers'
import { TMP_SEE_ALL_LINK } from 'views/Nft/market/constants'
import { CollectibleCard } from '../components/CollectibleCard'
import GridPlaceholder from '../components/GridPlaceholder'

/**
 * Fetch latest NFTs data from SG+API and combine them
 * @returns Array of NFT
 */
const useNewestNfts = () => {
  const [state, setstate] = useState<NFT[]>(null)

  useEffect(() => {
    const runEffect = async () => {
      const nftsFromSg = await getLatestListedNfts(8)
      const nftsFromApi = await getNftsFromDifferentCollectionsApi(
        nftsFromSg.map((nft) => ({ collectionAddress: nft.collection.id, tokenId: nft.tokenId })),
      )

      const nfts = nftsFromSg.map((nftFromSg, index) => {
        const nftFromApi = nftsFromApi[index]
        return { ...nftFromApi, tokens: [nftFromSg] }
      })
      setstate(nfts)
    }
    runEffect()
  }, [])

  return state
}

const Newest: React.FC = () => {
  const nfts = useNewestNfts()

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center" mb="26px">
        <Heading>Newest Arrivals</Heading>
        <Button
          as={Link}
          to={TMP_SEE_ALL_LINK}
          variant="secondary"
          scale="sm"
          endIcon={<ChevronRightIcon color="primary" />}
        >
          View All
        </Button>
      </Flex>
      {nfts ? (
        <Grid
          gridRowGap="24px"
          gridColumnGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
        >
          {nfts.map((nft) => {
            return <CollectibleCard key={nft.collectionAddress + nft.tokenId} nft={nft} />
          })}
        </Grid>
      ) : (
        <GridPlaceholder numItems={8} />
      )}
    </div>
  )
}

export default Newest
