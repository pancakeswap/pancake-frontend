import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useParams } from 'react-router'
import ConnectedProfile from './ConnectedProfile'
import UnconnectedProfile from './UnconnectedProfile'

const NftProfile = () => {
  const { account } = useWeb3React()
  const { accountAddress } = useParams<{ accountAddress: string }>()

  const isConnectedProfile = account?.toLowerCase() === accountAddress.toLowerCase()

  return <>{isConnectedProfile ? <ConnectedProfile /> : <UnconnectedProfile />}</>
}

export default NftProfile
