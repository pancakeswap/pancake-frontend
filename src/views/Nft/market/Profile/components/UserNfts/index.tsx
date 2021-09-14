import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { ethers } from 'ethers'
import { useUserNfts } from 'state/nftMarket/hooks'

const UserNfts = () => {
  const { nfts: userNfts } = useUserNfts()

  return (
    <>
      <span>Profile</span>
      {userNfts.map((nft) => {
        const tokenId = ethers.BigNumber.from(nft.tokenId).toString()
        return (
          <Text key={tokenId}>
            {tokenId} - {nft.collectionAddress}
          </Text>
        )
      })}
    </>
  )
}

export default UserNfts
