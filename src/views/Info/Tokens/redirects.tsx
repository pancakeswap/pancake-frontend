import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { isAddress } from 'ethers/lib/utils'
import TokenPage from './TokenPage'

const RedirectInvalidToken = (props: RouteComponentProps<{ address: string }>) => {
  const {
    match: {
      params: { address },
    },
  } = props

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  if (!isAddress(address.toLowerCase())) {
    return <Redirect to="/" />
  }
  return <TokenPage {...props} />
}

export default RedirectInvalidToken
