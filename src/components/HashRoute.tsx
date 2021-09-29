import React from 'react'
import { Route } from 'react-router'

const HashRoute = ({ component: Component, hash, ...routeProps }) => (
  <Route {...routeProps} component={({ location, ...props }) => location.hash === hash && <Component {...props} />} />
)

export default React.memo(HashRoute)
