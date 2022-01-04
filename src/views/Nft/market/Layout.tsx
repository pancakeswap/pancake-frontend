import React, { useEffect, useState } from 'react'
import PageLoader from 'components/Loader/PageLoader'
import { useFetchCollections, useGetNFTInitializationState } from 'state/nftMarket/hooks'
import { NFTMarketInitializationState } from 'state/nftMarket/types'

export function NftMarketLayout(page) {
  return <NftClientMarketLayout page={page} />
}

function NftClientMarketLayout({ page }) {
  const initializationState = useGetNFTInitializationState()
  useFetchCollections()

  if (initializationState !== NFTMarketInitializationState.INITIALIZED) {
    return <PageLoader />
  }
  return page
}
