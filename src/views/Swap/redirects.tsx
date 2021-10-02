import React from 'react'
import { Redirect, useLocation, useParams } from 'react-router-dom'

// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly() {
  const location = useLocation()
  return <Redirect to={{ ...location, pathname: '/swap' }} />
}

// Redirects from the /swap/:outputCurrency path to the /swap?outputCurrency=:outputCurrency format
export function RedirectToSwap() {
  const location = useLocation()
  const { search } = location
  const { outputCurrency } = useParams<{ outputCurrency: string }>()

  return (
    <Redirect
      to={{
        ...location,
        pathname: '/swap',
        search:
          search && search.length > 1
            ? `${search}&outputCurrency=${outputCurrency}`
            : `?outputCurrency=${outputCurrency}`,
      }}
    />
  )
}
