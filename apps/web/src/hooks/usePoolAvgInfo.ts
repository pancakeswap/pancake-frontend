/* eslint-disable no-console */
import { ChainId } from '@pancakeswap/sdk'
import { gql } from 'graphql-request'
import useSWR from 'swr'

import { v3Clients } from 'utils/graphql'

export interface UsePoolAvgInfoParams {
  numberOfDays?: number
  address?: string
  chainId?: ChainId
}

export const averageArray = (dataToCalculate: number[]): number => {
  let data = [...dataToCalculate]
  // Remove the highest and lowest volume to be more accurate
  if (data.length > 3) {
    data = data.sort((a: number, b: number) => a - b).slice(1, data.length - 1)
  }

  return data.reduce((result, val) => result + val, 0) / data.length
}

interface Info {
  volumeUSD: number
  tvlUSD: number
  feesUSD: number
}

const defaultInfo: Info = {
  volumeUSD: 0,
  tvlUSD: 0,
  feesUSD: 0,
}

export function usePoolAvgInfo({ address = '', numberOfDays = 7, chainId }: UsePoolAvgInfoParams) {
  const { data } = useSWR<{ volumeUSD: number; tvlUSD: number; feesUSD: number }>(
    address && chainId && [address, chainId],
    async () => {
      const client = v3Clients[chainId]
      if (!client) {
        console.log('[Failed] Trading volume', address, chainId)
        return defaultInfo
      }

      const query = gql`
        query getVolume($days: Int!, $address: String!) {
          poolDayDatas(first: $days, orderBy: date, orderDirection: desc, where: { pool: $address }) {
            volumeUSD
            tvlUSD
            feesUSD
          }
        }
      `
      const { poolDayDatas } = await client.request(query, {
        days: numberOfDays,
        address: address.toLocaleLowerCase(),
      })
      const volumes = poolDayDatas.map((d: { volumeUSD: string }) => Number(d.volumeUSD))
      const tvlUSDs = poolDayDatas.map((d: { tvlUSD: string }) => Number(d.tvlUSD))
      const feesUSDs = poolDayDatas.map((d: { feesUSD: string }) => Number(d.feesUSD))
      return {
        volumeUSD: averageArray(volumes),
        tvlUSD: averageArray(tvlUSDs),
        feesUSD: averageArray(feesUSDs),
      }
    },
    {
      revalidateOnFocus: false,
    },
  )

  return data || defaultInfo
}
