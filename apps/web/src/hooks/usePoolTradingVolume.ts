/* eslint-disable no-console */
import { ChainId } from '@pancakeswap/sdk'
import { gql } from 'graphql-request'
import useSWR from 'swr'

import { v3Clients } from 'utils/graphql'

interface Params {
  numberOfDays?: number
  address?: string
  chainId?: ChainId
}

export const averageArray = (data: number[]): number => {
  return data.reduce((result, val) => result + val, 0) / data.length
}

export function usePoolAvgTradingVolume({ address, numberOfDays = 7, chainId }: Params) {
  const { data } = useSWR(
    address && chainId && [address, chainId],
    async () => {
      const client = v3Clients[chainId]
      if (!client) {
        console.log('[Failed] Trading volume', address, chainId)
        return 0
      }

      const query = gql`
        query getVolume($days: Int!, $address: String!) {
          poolDayDatas(first: $days, orderBy: date, orderDirection: desc, where: { pool: $address }) {
            volumeUSD
          }
        }
      `
      const { poolDayDatas } = await client.request(query, {
        days: numberOfDays,
        address: address.toLocaleLowerCase(),
      })
      const volumes = poolDayDatas.map((d: { volumeUSD: string }) => Number(d.volumeUSD))
      // Remove the highest and lowest volume to be more accurate
      if (volumes.length > 3) {
        return averageArray(volumes.sort((a: number, b: number) => a - b).slice(1, volumes.length - 1))
      }
      return averageArray(volumes)
    },
    {
      revalidateOnFocus: false,
    },
  )

  return data
}
