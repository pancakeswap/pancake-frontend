import React, { useEffect, useMemo } from 'react'
import useFetchProtocolData from 'data/protocol/overview'
import useFetchGlobalChartData from 'data/protocol/chart'
import fetchTopTransactions from 'data/protocol/transactions'
import { useTopPoolAddresses } from 'data/pools/topPools'
import { usePoolDatas } from 'data/pools/poolData'
import { useFetchedTokenDatas } from 'data/tokens/tokenData'
import { useTopTokenAddresses } from 'data/tokens/topTokens'
import {
  useProtocolData,
  useProtocolChartData,
  useProtocolTransactions,
  useUpdatePoolData,
  useAllPoolData,
  useAddPoolKeys,
  useAllTokenData,
  useUpdateTokenData,
  useAddTokenKeys,
} from './hooks'

export const ProtocolUpdater: React.FC = () => {
  const [protocolData, setProtocolData] = useProtocolData()
  const { data: fetchedProtocolData, error, loading } = useFetchProtocolData()

  const [chartData, updateChartData] = useProtocolChartData()
  const { data: fetchedChartData, error: chartError } = useFetchGlobalChartData()

  const [transactions, updateTransactions] = useProtocolTransactions()

  // update overview data if available and not set
  useEffect(() => {
    if (protocolData === undefined && fetchedProtocolData && !loading && !error) {
      setProtocolData(fetchedProtocolData)
    }
  }, [error, fetchedProtocolData, loading, protocolData, setProtocolData])

  // update global chart data if available and not set
  useEffect(() => {
    if (chartData === undefined && fetchedChartData && !chartError) {
      updateChartData(fetchedChartData)
    }
  }, [chartData, chartError, fetchedChartData, updateChartData])

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchTopTransactions()
      if (data) {
        updateTransactions(data)
      }
    }
    if (!transactions) {
      fetch()
    }
  }, [transactions, updateTransactions])

  return null
}

export const PoolUpdater: React.FC = () => {
  const updatePoolData = useUpdatePoolData()
  const addPoolKeys = useAddPoolKeys()

  const allPoolData = useAllPoolData()
  const { loading, error, addresses } = useTopPoolAddresses()

  // add top pools on first load
  useEffect(() => {
    if (addresses && !error && !loading) {
      addPoolKeys(addresses)
    }
  }, [addPoolKeys, addresses, error, loading])

  // detect for which addresses we havent loaded pool data yet
  const unfetchedPoolAddresses = useMemo(() => {
    return Object.keys(allPoolData).reduce((accum: string[], address) => {
      const poolData = allPoolData[address]
      if (!poolData.data || !poolData.lastUpdated) {
        accum.push(address)
      }
      return accum
    }, [])
  }, [allPoolData])

  // fetch data for unfetched pools and update them
  const { error: poolDataError, loading: poolDataLoading, data: poolDatas } = usePoolDatas(unfetchedPoolAddresses)
  useEffect(() => {
    if (poolDatas && !poolDataError && !poolDataLoading) {
      updatePoolData(Object.values(poolDatas))
    }
  }, [poolDataError, poolDataLoading, poolDatas, updatePoolData])

  return null
}

export const TokenUpdater = (): null => {
  const updateTokenDatas = useUpdateTokenData()
  const addTokenKeys = useAddTokenKeys()

  const allTokenData = useAllTokenData()
  const { loading, error, addresses } = useTopTokenAddresses()

  // add top tokens on first load
  useEffect(() => {
    if (addresses && !error && !loading) {
      addTokenKeys(addresses)
    }
  }, [addTokenKeys, addresses, error, loading])

  // detect for which addresses we havent loaded token data yet
  const unfetchedTokenAddresses = useMemo(() => {
    return Object.keys(allTokenData).reduce((accum: string[], key) => {
      const tokenData = allTokenData[key]
      if (!tokenData.data || !tokenData.lastUpdated) {
        accum.push(key)
      }
      return accum
    }, [])
  }, [allTokenData])

  // fetch data for unfetched tokens and update them
  const {
    error: tokenDataError,
    loading: tokenDataLoading,
    data: tokenDatas,
  } = useFetchedTokenDatas(unfetchedTokenAddresses)
  useEffect(() => {
    if (tokenDatas && !tokenDataError && !tokenDataLoading) {
      updateTokenDatas(Object.values(tokenDatas))
    }
  }, [tokenDataError, tokenDataLoading, tokenDatas, updateTokenDatas])

  return null
}
