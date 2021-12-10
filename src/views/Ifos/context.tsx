import { useWeb3React } from '@web3-react/core'
import React, { createContext, FC, useContext, useMemo, useEffect } from 'react'
import { useFetchIfoPool, useFetchUserPools, useIfoPool, usePool, useFetchPublicPoolsData } from 'state/pools/hooks'
import { DeserializedPool, VaultKey } from 'state/types'
import { getAprData } from 'views/Pools/helpers'
import { useIfoPoolCredit } from './hooks/useIfoPoolCredit'

const IfoContext = createContext<{
  pool: DeserializedPool | null
  ifoCredit: ReturnType<typeof useIfoPoolCredit>
}>(null)

export const IfoContextProvider: FC = ({ children }) => {
  const { account } = useWeb3React()
  const ifoCredit = useIfoPoolCredit()
  const { getIfoPoolCredit } = ifoCredit

  useFetchIfoPool()
  // TODO: should be refactored to only fetch one pool we need
  useFetchPublicPoolsData()
  useFetchUserPools(account)

  const { pool } = usePool(0)

  useEffect(() => {
    getIfoPoolCredit()
  }, [getIfoPoolCredit])

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
        ifoCredit,
      }}
    >
      {children}
    </IfoContext.Provider>
  )
}

export const useIfoPoolContext = () => {
  return useContext(IfoContext)
}
