import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Button, Grid, Heading, Text, useModal } from '@pancakeswap/uikit'
import { useUserNfts, useNftsFromCollection } from 'state/nftMarket/hooks'
import useFetchUserNfts from '../Profile/hooks/useFetchUserNfts'
import BuyModal from '../components/BuySellModals/BuyModal'
import SellModal from '../components/BuySellModals/SellModal'
import { pancakeBunniesAddress } from '../constants'

const BuyBunnyButton = ({ nft, token }) => {
  const [onPresentModal] = useModal(<BuyModal nftToBuy={nft} />)
  const { account } = useWeb3React()
  const yourListing = token.currentSeller === account.toLowerCase()
  return (
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
      <Text>{token.marketData.currentAskPrice} BNB</Text>
      <Button scale="sm" variant="success" mr="4px" onClick={onPresentModal} disabled={yourListing}>
        {yourListing ? 'Its yours' : 'Buy'}
      </Button>
    </Grid>
  )
}

const BuyModalDemo = () => {
  const nfts = useNftsFromCollection(pancakeBunniesAddress)
  if (!nfts) return null

  const nftList = nfts.filter((nft) => {
    return !!nft.marketData.isTradable
  })

  return (
    <Box>
      {nftList.map((nft) => (
        <Box key={`${nft.tokenId}`} m="4px">
          <BuyBunnyButton key={nft.tokenId} nft={nft} token={nft} />
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
    if (userNfts.length > 0) {
      const nftsToSell = userNfts.map((nft) => {
        return {
          tokenId: nft.tokenId,
          name: nft.name,
          collection: {
            // TODO: doesn't have to be object, can plug NftToken directly
            name: nft.collectionName,
            address: nft.collectionAddress,
          },
          isTradable: nft.marketData.isTradable,
          lowestPrice: nft.marketData.latestTradedPriceInBNB, // TODO: need to get lowest
          currentAskPrice: nft.marketData.currentAskPrice,
          thumbnail: nft.image.thumbnail,
        }
      })
      setNftsWithMetadata(nftsToSell)
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
