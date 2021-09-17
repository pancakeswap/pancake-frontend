import React from 'react'
import { Box, Button, Text, useModal } from '@pancakeswap/uikit'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import BuyModal from '../components/BuySellModals/BuyModal'

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
      Buy {nft.name} for {token.currentAskPrice} BNB
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
      <Box m="4px">
        <BuyBunnyButton
          key="99999"
          nft={{ name: 'Dummy NFT', image: { thumbnail: '/images/nfts/baller-sm.png' } }}
          token={{ currentAskPrice: '0.423', tokenId: '99999' }}
        />
      </Box>
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

export default BuyModalDemo
