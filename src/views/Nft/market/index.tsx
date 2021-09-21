import React, { lazy } from 'react'
import { Route } from 'react-router-dom'
import { useFetchCollections, useGetNFTInitializationState } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import { NFTMarketInitializationState } from 'state/nftMarket/types'

const Home = lazy(() => import('./Home'))
const NftProfile = lazy(() => import('./Profile'))
const Collectible = lazy(() => import('./Collectible'))
const CollectibleOverview = lazy(() => import('./Collectibles'))
const IndividualNFTPage = lazy(() => import('./IndividualNFTPage'))
const BuySellDemo = lazy(() => import('./BuySellDemo'))

export const nftsBaseUrl = '/nfts'

const Market = () => {
  const initializationState = useGetNFTInitializationState()

  useFetchCollections()

  if (initializationState !== NFTMarketInitializationState.INITIALIZED) {
    return <PageLoader />
  }

  return (
    <>
      <Route exact path={nftsBaseUrl}>
        <Home />
      </Route>
      <Route exact path={`${nftsBaseUrl}/buy-sell-demo`}>
        <BuySellDemo />
      </Route>
      <Route exact path={`${nftsBaseUrl}/collections`}>
        <CollectibleOverview />
      </Route>
      <Route exact path={`${nftsBaseUrl}/collections/:slug`}>
        <Collectible />
      </Route>
      <Route path={`${nftsBaseUrl}/collections/:collectionAddress/:tokenId`}>
        <IndividualNFTPage />
      </Route>
      <Route path={`${nftsBaseUrl}/profile`}>
        <NftProfile />
      </Route>
    </>
  )
}

export default Market
