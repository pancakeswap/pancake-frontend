import { Duration, getUnixTime, startOfHour, sub } from 'date-fns'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from 'state'

import fetchPoolChartData from 'state/info/queries/pools/chartData'
import { fetchAllPoolData } from 'state/info/queries/pools/poolData'
import fetchPoolTransactions from 'state/info/queries/pools/transactions'
import { fetchGlobalChartData } from 'state/info/queries/protocol/chart'
import { fetchProtocolData } from 'state/info/queries/protocol/overview'
import fetchTopTransactions from 'state/info/queries/protocol/transactions'
import fetchTokenChartData from 'state/info/queries/tokens/chartData'
import fetchPoolsForToken from 'state/info/queries/tokens/poolsForToken'
import fetchTokenPriceData from 'state/info/queries/tokens/priceData'
import { fetchAllTokenData } from 'state/info/queries/tokens/tokenData'
import fetchTokenTransactions from 'state/info/queries/tokens/transactions'
import { Transaction } from 'state/info/types'
import useSWRImmutable from 'swr/immutable'
import { isAddress } from 'utils'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import {
  addPoolKeys,
  addTokenKeys,
  addTokenPoolAddresses,
  clearTokenData,
  updatePoolChartData,
  updatePoolData,
  updatePoolTransactions,
  updateTokenChartData,
  updateTokenData,
  updateTokenPriceData,
  updateTokenTransactions,
} from './actions'
import { MultiChianName } from './constant'
import { ChartEntry, PoolData, PriceChartEntry, ProtocolData, TokenData } from './types'
// Protocol hooks

export const useProtocolDataSWR = (): [ProtocolData | undefined] => {
  const chainName = useGetChainName()
  const [t24, t48] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48])
  const [block24, block48] = blocks ?? []
  const { data: protocolData, mutate } = useSWRImmutable(
    chainName && block24 && block48 ? [`info/protocol/updateProtocolData`, chainName] : null,
    () => fetchProtocolData(chainName, block24, block48),
  )

  return [protocolData]
}

export const useProtocolChartDataSWR = (): [ChartEntry[] | undefined] => {
  const chainName = useGetChainName()
  const { data: chartData } = useSWRImmutable([`info/protocol/updateProtocolChartData`, chainName], () =>
    fetchGlobalChartData(chainName),
  )
  return [chartData]
}

export const useProtocolTransactionsSWR = (): [Transaction[] | undefined] => {
  const chainName = useGetChainName()

  const { data: transactions } = useSWRImmutable([`info/protocol/updateProtocolTransactionsData`, chainName], () =>
    fetchTopTransactions(chainName),
  )
  return [transactions]
}

export const useAllPoolDataSWR = () => {
  const chainName = useGetChainName()
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const { data } = useSWRImmutable(blocks && chainName && [`info/pool/data`, chainName], () =>
    fetchAllPoolData(blocks, chainName),
  )
  return data ?? {}
}

export const usePoolDatasSWR = (poolAddresses: string[]): PoolData[] => {
  const allPoolData = useAllPoolDataSWR()

  const poolsWithData = poolAddresses
    .map((address) => {
      return allPoolData[address]?.data
    })
    .filter((pool) => pool)

  return poolsWithData
}

export const usePoolChartData = (address: string): ChartEntry[] | undefined => {
  const dispatch = useAppDispatch()
  const pool = useSelector((state: AppState) => state.info.pools.byAddress[address])
  const chartData = pool?.chartData
  const [error, setError] = useState(false)
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchPoolChartData(chainName, address)
      if (!fetchError && data) {
        dispatch(updatePoolChartData({ poolAddress: address, chartData: data }))
      }
      if (fetchError) {
        setError(fetchError)
      }
    }
    if (!chartData && !error) {
      fetch()
    }
  }, [address, dispatch, error, chartData, chainName])

  return chartData
}

export const usePoolTransactions = (address: string): Transaction[] | undefined => {
  const dispatch = useAppDispatch()
  const pool = useSelector((state: AppState) => state.info.pools.byAddress[address])
  const transactions = pool?.transactions
  const [error, setError] = useState(false)
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchPoolTransactions(chainName, address)
      if (fetchError) {
        setError(true)
      } else {
        dispatch(updatePoolTransactions({ poolAddress: address, transactions: data }))
      }
    }
    if (!transactions && !error) {
      fetch()
    }
  }, [address, dispatch, error, transactions, chainName])

  return transactions
}

// Tokens hooks

export const useAllTokenDataSWR = (): {
  [address: string]: { data?: TokenData }
} => {
  const chainName = useGetChainName()
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const { data } = useSWRImmutable(blocks && chainName && [`info/token/data`, chainName], () =>
    fetchAllTokenData(chainName, blocks),
  )
  return data ?? {}
}

export const useUpdateTokenData = (): ((tokens: TokenData[]) => void) => {
  const dispatch = useAppDispatch()
  return useCallback(
    (tokens: TokenData[]) => {
      dispatch(updateTokenData({ tokens }))
    },
    [dispatch],
  )
}

export const useClearTokenData = (): (() => void) => {
  const dispatch = useAppDispatch()
  return useCallback(() => {
    dispatch(clearTokenData())
  }, [dispatch])
}

export const useAddTokenKeys = (): ((addresses: string[]) => void) => {
  const dispatch = useAppDispatch()
  return useCallback((tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses })), [dispatch])
}

export const useTokenDatasSWR = (addresses?: string[]): TokenData[] | undefined => {
  const allTokenData = useAllTokenDataSWR()

  const tokensWithData = useMemo(() => {
    if (!addresses) {
      return undefined
    }
    return addresses
      .map((a) => {
        return allTokenData[a]?.data
      })
      .filter((token) => token)
  }, [addresses, allTokenData])

  return tokensWithData
}

export const useTokenDataSWR = (address: string | undefined): TokenData | undefined => {
  const allTokenData = useAllTokenDataSWR()
  return allTokenData[address]?.data
}

export const usePoolsForToken = (address: string): string[] | undefined => {
  const dispatch = useAppDispatch()
  const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
  const poolsForToken = token.poolAddresses
  const [error, setError] = useState(false)
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, addresses } = await fetchPoolsForToken(chainName, address)
      if (!fetchError && addresses) {
        dispatch(addTokenPoolAddresses({ tokenAddress: address, poolAddresses: addresses }))
      }
      if (fetchError) {
        setError(fetchError)
      }
    }
    if (!poolsForToken && !error) {
      fetch()
    }
  }, [address, dispatch, error, poolsForToken, chainName])

  return poolsForToken
}

export const useTokenChartData = (address: string): ChartEntry[] | undefined => {
  const dispatch = useAppDispatch()
  const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
  const { chartData } = token
  const [error, setError] = useState(false)
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchTokenChartData(chainName, address)
      if (!fetchError && data) {
        dispatch(updateTokenChartData({ tokenAddress: address, chartData: data }))
      }
      if (fetchError) {
        setError(fetchError)
      }
    }
    if (!chartData && !error) {
      fetch()
    }
  }, [address, dispatch, error, chartData, chainName])

  return chartData
}

export const useTokenPriceData = (
  address: string,
  interval: number,
  timeWindow: Duration,
): PriceChartEntry[] | undefined => {
  const dispatch = useAppDispatch()
  const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
  const priceData = token?.priceData[interval]
  const [error, setError] = useState(false)

  // construct timestamps and check if we need to fetch more data
  const oldestTimestampFetched = token?.priceData.oldestFetchedTimestamp
  const utcCurrentTime = getUnixTime(new Date()) * 1000
  const startTimestamp = getUnixTime(startOfHour(sub(utcCurrentTime, timeWindow)))
  const chainName = useGetChainName()
  useEffect(() => {
    const fetch = async () => {
      const { data, error: fetchingError } = await fetchTokenPriceData(chainName, address, interval, startTimestamp)
      if (data) {
        dispatch(
          updateTokenPriceData({
            tokenAddress: address,
            secondsInterval: interval,
            priceData: data,
            oldestFetchedTimestamp: startTimestamp,
          }),
        )
      }
      if (fetchingError) {
        setError(true)
      }
    }
    if (!priceData && !error) {
      fetch()
    }
  }, [address, dispatch, error, interval, oldestTimestampFetched, priceData, startTimestamp, timeWindow, chainName])

  return priceData
}

export const useTokenTransactions = (address: string): Transaction[] | undefined => {
  const dispatch = useAppDispatch()
  const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
  const { transactions } = token
  const [error, setError] = useState(false)
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchTokenTransactions(chainName, address)
      if (fetchError) {
        setError(true)
      } else if (data) {
        dispatch(updateTokenTransactions({ tokenAddress: address, transactions: data }))
      }
    }
    if (!transactions && !error) {
      fetch()
    }
  }, [address, dispatch, error, transactions, chainName])

  return transactions
}

export const useGetChainName = () => {
  const path = window.location.href

  const getChain = useCallback(() => {
    if (path.includes('eth') || path.includes('chainId=1')) return 'ETH'
    return 'BSC'
  }, [path])
  const [name, setName] = useState<MultiChianName | null>(getChain())
  const result = useMemo(() => name, [name])

  useEffect(() => {
    setName(getChain())
  }, [getChain])

  return result
  // const router = useRouter()
  // const [chain, setChain] = useState<'ETH' | 'BSC'>('BSC')
  // const { chainId } = useActiveWeb3React()
  // useEffect(() => {
  //   console.log('?????')
  //   const { chainName } = router.query
  //   if (ChainId.ETHEREUM === chainId || chainName === 'eth') setChain('ETH')
  //   else setChain('BSC')
  // }, [])
  // return chain
}

// export const useGetChainName = () => {
//   const router = useRouter()
//   const [name, setName] = useState<MultiChianName | null>(() => 'BSC')
//   const { chainName } = router.query
//   const { chainId } = useActiveWeb3React()
//   const result = useMemo(() => name, [name])
//   useEffect(() => {
//     if (ChainId.ETHEREUM === chainId || chainName === 'eth') {
//       setName('ETH')
//     } else setName('BSC')
//   }, [])

//   return result
//   // const router = useRouter()
//   // const [chain, setChain] = useState<'ETH' | 'BSC'>('BSC')
//   // const { chainId } = useActiveWeb3React()
//   // useEffect(() => {
//   //   console.log('?????')
//   //   const { chainName } = router.query
//   //   if (ChainId.ETHEREUM === chainId || chainName === 'eth') setChain('ETH')
//   //   else setChain('BSC')
//   // }, [])
//   // return chain
// }

export const useMultiChainPath = () => {
  const router = useRouter()
  const { chainName } = router.query
  return chainName ? `/${chainName}` : ''
}
