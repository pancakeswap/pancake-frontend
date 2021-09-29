import HashRoute from 'components/HashRoute'
import React, { lazy } from 'react'
import { Route, useRouteMatch } from 'react-router'

const Items = lazy(() => import('./Items'))
const Traits = lazy(() => import('./Traits'))
const IndividualNFTPage = lazy(() => import('./IndividualNFTPage'))

const Collection = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <HashRoute exact path={path} hash="" component={Items} />
      <HashRoute exact path={path} hash="#items" component={Items} />
      <HashRoute exact path={path} hash="#traits" component={Traits} />
      <Route path={`${path}/:tokenId`}>
        <IndividualNFTPage />
      </Route>
    </>
  )
}

export default Collection
