import { useEffect, useMemo } from 'react'
import useFetchProtocolData from 'state/info/queries/protocol/overview'
import useFetchGlobalChartData from 'state/info/queries/protocol/chart'
import fetchTopTransactions from 'state/info/queries/protocol/transactions'
import useTopPoolAddresses from 'state/info/queries/pools/topPools'
import usePoolDatas from 'state/info/queries/pools/poolData'
import useFetchedTokenDatas from 'state/info/queries/tokens/tokenData'
import useTopTokenAddresses from 'state/info/queries/tokens/topTokens'
import {
  useProtocolDataSWR,
  useProtocolData,
  useProtocolChartDataSWR,
  useProtocolChartData,
  useProtocolTransactions,
  useProtocolTransactionsSWR,
  useUpdatePoolData,
  useAllPoolData,
  useAddPoolKeys,
  useAllTokenData,
  useUpdateTokenData,
  useAddTokenKeys,
  useGetChainName,
} from './hooks'

export const ProtocolUpdater: React.FC<React.PropsWithChildren> = () => {
  return null
}

export const PoolUpdater: React.FC<React.PropsWithChildren> = () => {
  const updatePoolData = useUpdatePoolData()
  const addPoolKeys = useAddPoolKeys()

  const allPoolData = useAllPoolData()
  const addresses = useTopPoolAddresses()

  // add top pools on first load
  useEffect(() => {
    if (addresses.length > 0) {
      addPoolKeys(addresses)
    }
  }, [addPoolKeys, addresses])

  // detect for which addresses we havent loaded pool data yet
  const unfetchedPoolAddresses = useMemo(() => {
    return Object.keys(allPoolData).reduce((accum: string[], address) => {
      const poolData = allPoolData[address]
      if (!poolData.data) {
        accum.push(address)
      }
      return accum
    }, [])
  }, [allPoolData])

  // fetch data for unfetched pools and update them
  const { error: poolDataError, data: poolDatas } = usePoolDatas(unfetchedPoolAddresses)
  useEffect(() => {
    if (poolDatas && !poolDataError) {
      updatePoolData(Object.values(poolDatas))
    }
  }, [poolDataError, poolDatas, updatePoolData])

  return null
}

export const TokenUpdater = (): null => {
  const updateTokenDatas = useUpdateTokenData()
  const addTokenKeys = useAddTokenKeys()

  const allTokenData = useAllTokenData()
  const addresses = useTopTokenAddresses()
  const chainName = useGetChainName()

  // add top tokens on first load
  useEffect(() => {
    if (addresses.length > 0) {
      addTokenKeys(addresses)
    }
  }, [addTokenKeys, addresses])

  // detect for which addresses we havent loaded token data yet
  const unfetchedTokenAddresses = useMemo(() => {
    return Object.keys(allTokenData).reduce((accum: string[], key) => {
      const tokenData = allTokenData[key]
      if (!tokenData.data) {
        accum.push(key)
      }
      return accum
    }, [])
  }, [allTokenData])

  // fetch data for unfetched tokens and update them
  const { error: tokenDataError, data: tokenDatas } = useFetchedTokenDatas(chainName, unfetchedTokenAddresses)
  useEffect(() => {
    if (tokenDatas && !tokenDataError) {
      updateTokenDatas(Object.values(tokenDatas))
    }
  }, [tokenDataError, tokenDatas, updateTokenDatas])

  return null
}
