import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'
import { useState, useEffect, useMemo } from 'react'
import { client } from 'config/apolloClient'
import gql from 'graphql-tag'

export interface BnbPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

const BNB_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundle(id: "1") {
      bnbPrice
    }
    oneDay: bundle(id: "1", block: { number: $block24 }) {
      bnbPrice
    }
    twoDay: bundle(id: "1", block: { number: $block48 }) {
      bnbPrice
    }
    oneWeek: bundle(id: "1", block: { number: $blockWeek }) {
      bnbPrice
    }
  }
`

interface PricesResponse {
  current: {
    bnbPrice: string
  }
  oneDay: {
    bnbPrice: string
  }
  twoDay: {
    bnbPrice: string
  }
  oneWeek: {
    bnbPrice: string
  }
}

const fetchBnbPrices = async (
  blocks: [number, number, number],
): Promise<{ bnbPrices: BnbPrices | undefined; error: boolean }> => {
  try {
    const { data, error } = await client.query<PricesResponse>({
      query: BNB_PRICES,
      variables: {
        block24: blocks[0],
        block48: blocks[1],
        blockWeek: blocks[2],
      },
    })

    if (error) {
      throw error
    }
    return {
      error: false,
      bnbPrices: {
        current: parseFloat(data.current?.bnbPrice ?? '0'),
        oneDay: parseFloat(data.oneDay?.bnbPrice ?? '0'),
        twoDay: parseFloat(data.twoDay?.bnbPrice ?? '0'),
        week: parseFloat(data.oneWeek?.bnbPrice ?? '0'),
      },
    }
  } catch (e) {
    console.error('Failed to fetch BNB prices', e)
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

  const [t24, t48, tWeek] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])

  const formattedBlocks = useMemo(() => {
    if (blocks && !blockError) {
      return blocks.map((b) => parseFloat(b.number))
    }
    return undefined
  }, [blocks, blockError])

  useEffect(() => {
    const fetch = async () => {
      const { bnbPrices, error: fetchError } = await fetchBnbPrices(formattedBlocks as [number, number, number])
      if (fetchError) {
        setError(true)
      } else {
        setPrices(bnbPrices)
      }
    }
    if (!prices && !error && formattedBlocks) {
      fetch()
    }
  }, [error, prices, formattedBlocks])

  return prices
}
