import React from 'react'
import { useParams } from 'react-router'
import { pancakeBunniesAddress } from '../../constants'
import IndividualPancakeBunnyPage from './PancakeBunnyPage'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  // For PancakeBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = useParams<{ collectionAddress: string; tokenId: string }>()

  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()
  if (isPBCollection) {
    return <IndividualPancakeBunnyPage bunnyId={tokenId} />
  }

  return <IndividualNFTPage collectionAddress={collectionAddress} tokenId={tokenId} />
}

export default IndividualNFTPageRouter
