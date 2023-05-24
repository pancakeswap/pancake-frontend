import { createFarmFetcherV3, ComputedFarmConfigV3, fetchCommonTokenUSDValue } from '@pancakeswap/farms'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { priceHelperTokens } from '@pancakeswap/farms/constants/common'
import { Currency } from '@pancakeswap/sdk'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
import { useMemo } from 'react'
import useSWR from 'swr'

import { FAST_INTERVAL } from 'config/constants'
import { getViemClients } from 'utils/viem'

const farmFetcherV3 = createFarmFetcherV3(getViemClients)

interface FarmParams {
  currencyA?: Currency
  currencyB?: Currency
  feeAmount?: FeeAmount
}

export function useFarm({ currencyA, currencyB, feeAmount }: FarmParams) {
  const chainId = currencyA?.chainId
  const farmConfig = useMemo(() => {
    if (!chainId || !currencyA || !currencyB || !feeAmount) {
      return null
    }
    const farms: ComputedFarmConfigV3[] = farmsV3ConfigChainMap[chainId]
    if (!farms) {
      return null
    }
    const lpAddress = Pool.getAddress(currencyA.wrapped, currencyB.wrapped, feeAmount)
    const farm = farms.find((f) => f.lpAddress === lpAddress)
    return farm ?? null
  }, [chainId, currencyA, currencyB, feeAmount])

  return useSWR(
    chainId && farmConfig && [chainId, farmConfig.token0.symbol, farmConfig.token1.symbol, farmConfig.feeAmount],
    async () => {
      const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId])

      try {
        const data = await farmFetcherV3.fetchFarms({
          chainId,
          farms: [farmConfig],
          commonPrice,
        })

        const { farmsWithPrice, cakePerSecond, poolLength } = data
        const farm = farmsWithPrice[0]
        return {
          farm,
          poolLength,
          cakePerSecond,
        }
      } catch (error) {
        console.error(error)
        // return fallback for now since not all chains supported
        return null
      }
    },
    {
      refreshInterval: FAST_INTERVAL * 3,
      dedupingInterval: FAST_INTERVAL,
    },
  )
}
