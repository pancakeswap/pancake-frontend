import { useWeb3React } from '@web3-react/core'
import React, { createContext, FC, useContext, useMemo } from 'react'
import { useFetchIfoPool, useFetchPublicPoolsData, useFetchUserPools, useIfoPool, usePool } from 'state/pools/hooks'
import { DeserializedPool, VaultKey } from 'state/types'
import { getAprData } from 'views/Pools/helpers'

const IfoContext = createContext<{
  pool?: DeserializedPool | null
}>(null)

export const IfoContextProvider: FC = ({ children }) => {
  const { account } = useWeb3React()

  useFetchIfoPool()
  // TODO: should be refactored to only fetch one pool we need
  useFetchPublicPoolsData()
  useFetchUserPools(account)

  const { pool } = usePool(0)

  const {
    fees: { performanceFeeAsDecimal },
  } = useIfoPool()

  const ifoPoolWithApr = useMemo(() => {
    const ifoPool = pool
    ifoPool.vaultKey = VaultKey.IfoPool
    ifoPool.apr = getAprData(ifoPool, performanceFeeAsDecimal).apr
    return ifoPool
  }, [performanceFeeAsDecimal, pool])

  return (
    <IfoContext.Provider
      value={{
        pool: ifoPoolWithApr,
      }}
    >
      {children}
    </IfoContext.Provider>
  )
}

export const useIfoPoolContext = () => {
  return useContext(IfoContext)
}
