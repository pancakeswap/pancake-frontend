import React, { lazy } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router'

const Items = lazy(() => import('./Items'))
const Traits = lazy(() => import('./Traits'))
const IndividualNFTPage = lazy(() => import('./IndividualNFTPage'))

const Collection = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={path}>
        <Items />
      </Route>
      <Route exact path={`${path}/traits`}>
        <Traits />
      </Route>
      <Route path={`${path}/:tokenId`}>
        <IndividualNFTPage />
      </Route>
    </Switch>
  )
}

export default Collection
