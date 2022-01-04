import PageLoader from 'components/Loader/PageLoader'
import React from 'react'
import { useFetchCollections, useGetNFTInitializationState } from 'state/nftMarket/hooks'
import { NFTMarketInitializationState } from 'state/nftMarket/types'

export function NftMarketLayout(page) {
  const initializationState = useGetNFTInitializationState()
  useFetchCollections()

  if (initializationState !== NFTMarketInitializationState.INITIALIZED) {
    return <PageLoader />
  }
  return page
}
