import React from 'react'
import PoolsTable from './PoolTable'
import { DeserializedPool } from 'state/types'

interface OldPoolProps {
  account: string
  pools: DeserializedPool[]
  userDataLoaded: boolean
}

const OldPool: React.FC<OldPoolProps> = ({ account, pools, userDataLoaded }) => {
  const userDataReady: boolean = !account || (!!account && userDataLoaded)
  return <PoolsTable pools={pools} account={account} userDataReady={userDataReady} />
}

export default OldPool
