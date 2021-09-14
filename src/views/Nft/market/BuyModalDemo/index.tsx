import React from 'react'
import { ethers } from 'ethers'
import { Box, Button, Text, useModal } from '@pancakeswap/uikit'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import BuyModal from '../components/BuyModal'

const tempNFTtoBuy = {
  collection: {
    address: '0x60935f36e4631f73f0f407e68642144e07ac7f5e',
    name: 'Pancake Bunnies',
  },
  token: {
    tokenId: '122',
    name: 'Baller',
    imageUrl: '/images/nfts/baller-sm.png',
  },
  price: ethers.BigNumber.from(1),
}

const BuyBunnyButton = ({ nft, token }) => {
  const nftToBuy = {
    collection: {
      address: '0x60935f36e4631f73f0f407e68642144e07ac7f5e',
      name: 'Pancake Bunnies',
    },
    token,
    name: nft.name,
    image: nft.image,
  }
  const [onPresentModal] = useModal(<BuyModal nftToBuy={nftToBuy} />)
  return (
    <Button mr="4px" onClick={onPresentModal}>
      Buy for {token.currentAskPrice} BNB
    </Button>
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
    <Box p="24px">
      <Text bold>Buy pancake bunnies</Text>
      <BuyBunnyButton
        key="99999"
        nft={{ name: 'Dummy', image: '/images/nfts/baller-sm.png' }}
        token={{ currentAskPrice: '0.023', tokenId: '99999' }}
      />
      {nftList.map((nft) => (
        <Box key={nft.id}>
          <Text>{nft.name}</Text>
          {Object.values(nft.tokens).map((token) => (
            <BuyBunnyButton key={token.tokenId} nft={nft} token={token} />
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default BuyModalDemo
