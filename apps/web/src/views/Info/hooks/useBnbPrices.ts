import { useEffect, useState } from 'react'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { explorerApiClient } from 'state/info/api/client'
import { ChainId } from '@pancakeswap/chains'
import { WNATIVE } from '@pancakeswap/sdk'
import dayjs from 'dayjs'

export interface BnbPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

const fetchBnbPrices = async (
  t24: number,
  t48: number,
  tWeek: number,
): Promise<{ bnbPrices: BnbPrices | undefined; error: boolean }> => {
  try {
    const wNative = WNATIVE[ChainId.BSC]
    const currentTime = dayjs().unix()

    const times = [currentTime, t24, t48, tWeek]

    const [currentPrice, t24Price, t48Price, tWeekPrice] = await Promise.all(
      times.map((t) =>
        explorerApiClient
          .GET('/cached/tokens/{chainName}/{address}/price', {
            signal: null,
            params: {
              path: {
                chainName: 'bsc',
                address: wNative.address,
              },
              query: {
                timestamp: t,
                protocols: ['v3', 'v2', 'stable'],
              },
            },
          })
          .then((res) => res.data?.priceUSD),
      ),
    )

    return {
      error: false,
      bnbPrices: {
        current: parseFloat(currentPrice ?? '0'),
        oneDay: parseFloat(t24Price ?? '0'),
        twoDay: parseFloat(t48Price ?? '0'),
        week: parseFloat(tWeekPrice ?? '0'),
      },
    }
  } catch (error) {
    console.error('Failed to fetch BNB prices', error)
    return {
      error: true,
      bnbPrices: undefined,
    }
  }
}

/**
 * Returns BNB prices at current, 24h, 48h, and 7d intervals
 */
export const useBnbPrices = (): BnbPrices | undefined => {
  const [prices, setPrices] = useState<BnbPrices | undefined>()
  const [error, setError] = useState(false)

  const [t24, t48, tWeek] = getDeltaTimestamps()

  useEffect(() => {
    const fetch = async () => {
      const { bnbPrices, error: fetchError } = await fetchBnbPrices(t24, t48, tWeek)
      if (fetchError) {
        setError(true)
      } else {
        setPrices(bnbPrices)
      }
    }
    if (!prices && !error) {
      fetch()
    }
  }, [error, prices, t24, t48, tWeek])

  return prices
}
