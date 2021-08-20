import React, { useEffect } from 'react'
import useFetchProtocolData from 'data/protocol/overview'
import useFetchGlobalChartData from 'data/protocol/chart'
import fetchTopTransactions from 'data/protocol/transactions'
import { useProtocolData, useProtocolChartData, useProtocolTransactions } from './hooks'

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
