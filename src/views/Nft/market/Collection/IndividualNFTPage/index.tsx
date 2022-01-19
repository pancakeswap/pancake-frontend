import React from 'react'
import { useRouter } from 'next/router'
import { pancakeBunniesAddress } from '../../constants'
import IndividualPancakeBunnyPage from './PancakeBunnyPage'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  // For PancakeBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = useRouter().query

  const isPBCollection = String(collectionAddress).toLowerCase() === pancakeBunniesAddress.toLowerCase()
  if (isPBCollection) {
    return <IndividualPancakeBunnyPage bunnyId={String(tokenId)} />
  }

  return <IndividualNFTPage collectionAddress={String(collectionAddress)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
