import { useMemo } from 'react'

import dayjs from 'dayjs'
import { ChartDayData, GenericChartEntry, PoolChartEntry, TokenChartEntry } from '../types'
import { unixToDate } from '../utils/date'

function unixToType(unix: number, type: 'month' | 'week') {
  const date = dayjs.unix(unix).utc()

  switch (type) {
    case 'month':
      return date.format('YYYY-MM')
    case 'week':
      // eslint-disable-next-line no-case-declarations
      let week = date.week().toString()
      if (week.length === 1) {
        week = `0${week}`
      }
      return `${date.year()}-${week}`
    default:
      return ''
  }
}

export function useTransformedVolumeData(
  chartData: ChartDayData[] | PoolChartEntry[] | TokenChartEntry[] | undefined,
  type: 'month' | 'week',
) {
  return useMemo(() => {
    if (chartData) {
      const data: Record<string, GenericChartEntry> = {}

      chartData.forEach(({ date, volumeUSD }: { date: number; volumeUSD: number }) => {
        const group = unixToType(date, type)
        if (data[group]) {
          data[group].value += volumeUSD
        } else {
          data[group] = {
            time: unixToDate(date),
            value: volumeUSD,
          }
        }
      })

      return Object.values(data)
    }
    return []
  }, [chartData, type])
}
