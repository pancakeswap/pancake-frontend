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
  feeUSD: number
}

const defaultInfo: Info = {
  volumeUSD: 0,
  tvlUSD: 0,
  feeUSD: 0,
}

export function usePoolAvgInfo({ address = '', numberOfDays = 7, chainId }: UsePoolAvgInfoParams) {
  const { data } = useSWR<Info>(
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
            protocolFeesUSD
          }
        }
      `
      const { poolDayDatas } = await client.request(query, {
        days: numberOfDays,
        address: address.toLocaleLowerCase(),
      })
      const volumes = poolDayDatas.map((d: { volumeUSD: string }) => Number(d.volumeUSD))
      const feeUSDs = poolDayDatas.map(
        (d: { feesUSD: string; protocolFeesUSD: string }) => Number(d.feesUSD) - Number(d.protocolFeesUSD),
      )
      return {
        volumeUSD: averageArray(volumes),
        tvlUSD: parseFloat(poolDayDatas[0]?.tvlUSD) || 0,
        feeUSD: averageArray(feeUSDs),
      }
    },
    {
      revalidateOnFocus: false,
    },
  )

  return data || defaultInfo
}
