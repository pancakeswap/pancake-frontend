import HashRoute from 'components/HashRoute'
import PageLoader from 'components/Loader/PageLoader'
import React, { lazy } from 'react'
import { Route, useParams, useRouteMatch } from 'react-router'
import { useFetchCollection, useGetCollection } from 'state/nftMarket/hooks'

const Items = lazy(() => import('./Items'))
const Traits = lazy(() => import('./Traits'))
const IndividualNFTPageRouter = lazy(() => import('./IndividualNFTPage'))

const Collection = () => {
  const { path } = useRouteMatch()
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const collection = useGetCollection(collectionAddress)

  useFetchCollection(collectionAddress)

  if (!collection) {
    return <PageLoader />
  }

  return (
    <>
      <HashRoute exact path={path} hash="" component={Items} />
      <HashRoute exact path={path} hash="#items" component={Items} />
      <HashRoute exact path={path} hash="#traits" component={Traits} />
      <Route path={`${path}/:tokenId`}>
        <IndividualNFTPageRouter />
      </Route>
    </>
  )
}

export default Collection
