import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Button, Grid, Heading, Text, useModal } from '@pancakeswap/uikit'
import { useUserNfts, useNftsFromCollection } from 'state/nftMarket/hooks'
import useFetchUserNfts from '../Profile/hooks/useFetchUserNfts'
import BuyModal from '../components/BuySellModals/BuyModal'
import SellModal from '../components/BuySellModals/SellModal'
import { BuyNFT } from '../components/BuySellModals/BuyModal/types'

const BuyBunnyButton = ({ nft, token }) => {
  const nftToBuy: BuyNFT = {
    collection: {
      address: '0x60935f36e4631f73f0f407e68642144e07ac7f5e',
      name: 'Pancake Bunnies',
    },
    token,
    name: nft.name,
    image: nft.image,
  }
  const [onPresentModal] = useModal(<BuyModal nftToBuy={nftToBuy} />)
  const { account } = useWeb3React()
  const yourListing = token.currentSeller === account.toLowerCase()
  return (
    <Grid
      key={nftToBuy.token.tokenId}
      border="1px solid grey"
      borderRadius="8px"
      p="8px"
      mb="8px"
      justifyContent="space-between"
      alignItems="center"
      gridTemplateColumns="1fr 1fr 1fr 1fr"
    >
      <Text bold mr="8px">
        {nftToBuy.token.tokenId}
      </Text>
      <Text bold color="secondary" mr="8px">
        {nftToBuy.name}
      </Text>
      <Text>{token.currentAskPrice} BNB</Text>
      <Button scale="sm" variant="success" mr="4px" onClick={onPresentModal} disabled={yourListing}>
        {yourListing ? 'Its yours' : 'Buy'}
      </Button>
    </Grid>
  )
}

const BuyModalDemo = () => {
  const nfts = useNftsFromCollection('0x60935f36e4631f73f0f407e68642144e07ac7f5e')
  if (!nfts) return null

  const nftList = Object.values(nfts).filter((nft) => {
    const tokens = Object.values(nft.tokens)
    const isTradable = tokens.find((t) => t?.isTradable)
    return !!isTradable
  })

  return (
    <Box>
      {nftList.map((nft) => (
        <Box key={nft.id} m="4px">
          {Object.values(nft.tokens).map((token) => (
            <BuyBunnyButton key={token.tokenId} nft={nft} token={token} />
          ))}
        </Box>
      ))}
    </Box>
  )
}

const SellButton = ({ nft }) => {
  const [onPresentModal] = useModal(<SellModal variant="sell" nftToSell={nft} />)
  return (
    <Button onClick={onPresentModal} scale="sm" variant="danger">
      Sell
    </Button>
  )
}

const EditButton = ({ nft }) => {
  const [onPresentModal] = useModal(<SellModal variant="edit" nftToSell={nft} />)
  return (
    <Button onClick={onPresentModal} scale="sm" variant="subtle">
      Edit
    </Button>
  )
}

const SellModalDemo = () => {
  const [nftsWithMetadata, setNftsWithMetadata] = useState([])
  const { account } = useWeb3React()
  const { nfts: userNfts } = useUserNfts()
  useFetchUserNfts(account)

  useEffect(() => {
    const fetchMetadata = async () => {
      const fullNftData = await Promise.all(
        userNfts.map(async (nft) => {
          if (nft.metadataUrl) {
            const res = await fetch(`https://ipfs.io/ipfs/${nft.metadataUrl.split('//')[1]}`)
            const metadata = await res.json()
            return { ...nft, metadata }
          }
          return {
            ...nft,
            metadata: { name: 'Sleepy', image: 'ipfs://QmYD9AtzyQPjSa9jfZcZq88gSaRssdhGmKqQifUDjGFfXm/sleepy.png' },
          }
        }),
      )

      const nftsToSell = fullNftData.map((nft) => ({
        tokenId: nft.tokenId,
        name: nft.metadata.name,
        collection: {
          address: nft.collection.id,
          name: 'Pancake Bunnies',
        },
        isTradable: nft.isTradable,
        lowestPrice: nft.latestTradedPriceInBNB, // TODO: should get lowest
        currentAskPrice: nft.currentAskPrice,
        thumbnail: `https://ipfs.io/ipfs/${nft.metadata.image.split('//')[1]}`, // TODO: need smaller thumbnail here
      }))
      setNftsWithMetadata(nftsToSell)
    }
    if (userNfts.length > 0) {
      fetchMetadata()
    }
  }, [userNfts])

  return (
    <Box>
      {nftsWithMetadata.length === 0 && <Text>Loading nfts... (or you have 0 NFTs)</Text>}
      {nftsWithMetadata.map((nft) => (
        <Grid
          key={nft.tokenId}
          border="1px solid grey"
          borderRadius="8px"
          p="8px"
          mb="8px"
          justifyContent="space-between"
          alignItems="center"
          gridTemplateColumns="1fr 1fr 1fr 1fr"
        >
          <Text bold mr="8px">
            {nft.tokenId}
          </Text>
          <Text bold color="secondary" mr="8px">
            {nft.name}
          </Text>
          <Text>{nft.isTradable ? 'On sale' : 'Not on sale'}</Text>
          {nft.isTradable ? <EditButton nft={nft} /> : <SellButton nft={nft} />}
        </Grid>
      ))}
    </Box>
  )
}

const BuySellDemo = () => {
  return (
    <Box p="24px" width="45%">
      <Heading mb="8px">BUY</Heading>
      <BuyModalDemo />
      <div style={{ border: '1px solid grey', marginTop: '24px' }} />
      <Heading mt="24px" mb="8px">
        SELL / MANAGE YOUR NFTS
      </Heading>
      <SellModalDemo />
    </Box>
  )
}

export default BuySellDemo
