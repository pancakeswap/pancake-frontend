import { useCallback, useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getUnixTime, startOfHour, Duration, sub } from 'date-fns'
import { AppState, useAppDispatch } from 'state'
import { isAddress } from 'utils'
import { Transaction } from 'state/info/types'
import fetchPoolChartData from 'state/info/queries/pools/chartData'
import fetchPoolTransactions from 'state/info/queries/pools/transactions'
import fetchTokenChartData from 'state/info/queries/tokens/chartData'
import fetchTokenTransactions from 'state/info/queries/tokens/transactions'
import fetchTokenPriceData from 'state/info/queries/tokens/priceData'
import fetchPoolsForToken from 'state/info/queries/tokens/poolsForToken'
import {
  updateProtocolData,
  updateProtocolChartData,
  updateProtocolTransactions,
  updatePoolData,
  addPoolKeys,
  updatePoolChartData,
  updatePoolTransactions,
  updateTokenData,
  addTokenKeys,
  addTokenPoolAddresses,
  updateTokenChartData,
  updateTokenPriceData,
  updateTokenTransactions,
} from './actions'
import { ProtocolData, PoolData, TokenData, ChartEntry, PriceChartEntry } from './types'

// Protocol hooks

export const useProtocolData = (): [ProtocolData | undefined, (protocolData: ProtocolData) => void] => {
  const protocolData: ProtocolData | undefined = useSelector((state: AppState) => state.info.protocol.overview)

  const dispatch = useAppDispatch()
  const setProtocolData: (protocolData: ProtocolData) => void = useCallback(
    (data: ProtocolData) => dispatch(updateProtocolData({ protocolData: data })),
    [dispatch],
  )

  return [protocolData, setProtocolData]
}

export const useProtocolChartData = (): [ChartEntry[] | undefined, (chartData: ChartEntry[]) => void] => {
  const chartData: ChartEntry[] | undefined = useSelector((state: AppState) => state.info.protocol.chartData)
  const dispatch = useAppDispatch()
  const setChartData: (chartData: ChartEntry[]) => void = useCallback(
    (data: ChartEntry[]) => dispatch(updateProtocolChartData({ chartData: data })),
    [dispatch],
  )
  return [chartData, setChartData]
}

export const useProtocolTransactions = (): [Transaction[] | undefined, (transactions: Transaction[]) => void] => {
  const transactions: Transaction[] | undefined = useSelector((state: AppState) => state.info.protocol.transactions)
  const dispatch = useAppDispatch()
  const setTransactions: (transactions: Transaction[]) => void = useCallback(
    (transactionsData: Transaction[]) => dispatch(updateProtocolTransactions({ transactions: transactionsData })),
    [dispatch],
  )
  return [transactions, setTransactions]
}

// Pools hooks

export const useAllPoolData = (): {
  [address: string]: { data?: PoolData }
} => {
  return useSelector((state: AppState) => state.info.pools.byAddress)
}

export const useUpdatePoolData = (): ((pools: PoolData[]) => void) => {
  const dispatch = useAppDispatch()
  return useCallback((pools: PoolData[]) => dispatch(updatePoolData({ pools })), [dispatch])
}

export const useAddPoolKeys = (): ((addresses: string[]) => void) => {
  const dispatch = useAppDispatch()
  return useCallback((poolAddresses: string[]) => dispatch(addPoolKeys({ poolAddresses })), [dispatch])
}

export const usePoolDatas = (poolAddresses: string[]): PoolData[] => {
  const allPoolData = useAllPoolData()
  const addNewPoolKeys = useAddPoolKeys()

  const untrackedAddresses = poolAddresses.reduce((accum: string[], address) => {
    if (!Object.keys(allPoolData).includes(address)) {
      accum.push(address)
    }
    return accum
  }, [])

  useEffect(() => {
    if (untrackedAddresses) {
      addNewPoolKeys(untrackedAddresses)
    }
  }, [addNewPoolKeys, untrackedAddresses])

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

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchPoolChartData(address)
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
  }, [address, dispatch, error, chartData])

  return chartData
}

export const usePoolTransactions = (address: string): Transaction[] | undefined => {
  const dispatch = useAppDispatch()
  const pool = useSelector((state: AppState) => state.info.pools.byAddress[address])
  const transactions = pool?.transactions
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchPoolTransactions(address)
      if (fetchError) {
        setError(true)
      } else {
        dispatch(updatePoolTransactions({ poolAddress: address, transactions: data }))
      }
    }
    if (!transactions && !error) {
      fetch()
    }
  }, [address, dispatch, error, transactions])

  return transactions
}

// Tokens hooks

export const useAllTokenData = (): {
  [address: string]: { data?: TokenData }
} => {
  return useSelector((state: AppState) => state.info.tokens.byAddress)
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

export const useAddTokenKeys = (): ((addresses: string[]) => void) => {
  const dispatch = useAppDispatch()
  return useCallback((tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses })), [dispatch])
}

export const useTokenDatas = (addresses?: string[]): TokenData[] | undefined => {
  const allTokenData = useAllTokenData()
  const addNewTokenKeys = useAddTokenKeys()

  // if token not tracked yet track it
  addresses?.forEach((a) => {
    if (!allTokenData[a]) {
      addNewTokenKeys([a])
    }
  })

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

export const useTokenData = (address: string | undefined): TokenData | undefined => {
  const allTokenData = useAllTokenData()
  const addNewTokenKeys = useAddTokenKeys()

  if (!address || !isAddress(address)) {
    return undefined
  }

  // if token not tracked yet track it
  if (!allTokenData[address]) {
    addNewTokenKeys([address])
  }

  return allTokenData[address]?.data
}

export const usePoolsForToken = (address: string): string[] | undefined => {
  const dispatch = useAppDispatch()
  const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
  const poolsForToken = token.poolAddresses
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, addresses } = await fetchPoolsForToken(address)
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
  }, [address, dispatch, error, poolsForToken])

  return poolsForToken
}

export const useTokenChartData = (address: string): ChartEntry[] | undefined => {
  const dispatch = useAppDispatch()
  const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
  const { chartData } = token
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchTokenChartData(address)
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
  }, [address, dispatch, error, chartData])

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

  useEffect(() => {
    const fetch = async () => {
      const { data, error: fetchingError } = await fetchTokenPriceData(address, interval, startTimestamp)
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
  }, [address, dispatch, error, interval, oldestTimestampFetched, priceData, startTimestamp, timeWindow])

  return priceData
}

export const useTokenTransactions = (address: string): Transaction[] | undefined => {
  const dispatch = useAppDispatch()
  const token = useSelector((state: AppState) => state.info.tokens.byAddress[address])
  const { transactions } = token
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { error: fetchError, data } = await fetchTokenTransactions(address)
      if (fetchError) {
        setError(true)
      } else if (data) {
        dispatch(updateTokenTransactions({ tokenAddress: address, transactions: data }))
      }
    }
    if (!transactions && !error) {
      fetch()
    }
  }, [address, dispatch, error, transactions])

  return transactions
}
