import PageLoader from 'components/Loader/PageLoader'
import React, { FC } from 'react'
import { useFetchCollections, useGetNFTInitializationState } from 'state/nftMarket/hooks'
import { NFTMarketInitializationState } from 'state/nftMarket/types'

export const NftMarketLayout: FC = ({ children }) => {
  const initializationState = useGetNFTInitializationState()
  useFetchCollections()

  if (initializationState !== NFTMarketInitializationState.INITIALIZED) {
    return <PageLoader />
  }
  return <>{children}</>
}
