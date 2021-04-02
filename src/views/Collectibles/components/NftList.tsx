import React from 'react'
import orderBy from 'lodash/orderBy'
import nfts from 'config/constants/nfts'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import NftCard from './NftCard'
import NftGrid from './NftGrid'
import BunnySpeciaCard from './NftCard/BunnySpecialCard'

/**
 * A map of bunnyIds to special campaigns (NFT distribution)
 * Each NftCard is responsible for checking it's own claim status
 *
 */
const nftComponents = {
  10: BunnySpeciaCard,
  11: BunnySpeciaCard,
}

const NftList = () => {
  const { nfts: nftTokenIds } = useGetWalletNfts()

  return (
    <NftGrid>
      {orderBy(nfts, 'sortOrder').map((nft) => {
        const tokenIds = nftTokenIds[nft.bunnyId] ? nftTokenIds[nft.bunnyId].tokenIds : []
        const Card = nftComponents[nft.bunnyId] || NftCard

        return (
          <div key={nft.name}>
            <Card nft={nft} tokenIds={tokenIds} />
          </div>
        )
      })}
    </NftGrid>
  )
}

export default NftList
