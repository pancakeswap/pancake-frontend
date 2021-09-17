import React, { lazy } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useFetchCollections, useGetNFTInitializationState } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import { NFTMarketInitializationState } from 'state/nftMarket/types'

const Home = lazy(() => import('./Home'))
const NftProfile = lazy(() => import('./Profile'))
const Collectible = lazy(() => import('./Collectible'))
const CollectibleOverview = lazy(() => import('./Collectibles'))
const IndividualNFTPage = lazy(() => import('./IndividualNFTPage'))
const BuyModalDemo = lazy(() => import('./BuyModalDemo'))

const Market = () => {
  const { path } = useRouteMatch()
  const initializationState = useGetNFTInitializationState()

  useFetchCollections()

  if (initializationState !== NFTMarketInitializationState.INITIALIZED) {
    return <PageLoader />
  }

  return (
    <>
      <Route exact path={path}>
        <Home />
      </Route>
      <Route exact path={`${path}/buy-modal-demo`}>
        <BuyModalDemo />
      </Route>
      <Route exact path={`${path}/collections`}>
        <CollectibleOverview />
      </Route>
      <Route path={`${path}/collections/:slug`}>
        <Collectible />
      </Route>
      <Route path={`${path}/profile`}>
        <NftProfile />
      </Route>
      <Route exact path={`${path}/item/:id`}>
        <IndividualNFTPage />
      </Route>
    </>
  )
}

export default Market
