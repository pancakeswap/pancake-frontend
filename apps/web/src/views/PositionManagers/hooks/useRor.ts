import { Currency } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { ONE_DAY_MILLISECONDS } from 'config/constants/info'
import { usePositionManagerAdapterContract } from 'hooks/useContract'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { useChainId } from 'wagmi'
import { floorToUTC00 } from '../utils/floorCurrentTimestamp'
import { useFetchVaultHistory } from './useFetchVaultHistory'

interface RorProps {
  vault: Address | undefined
  adapterAddress: Address | undefined
  currencyA: Currency
  currencyB: Currency
  token0USDPrice: number | undefined
  token1USDPrice: number | undefined
  startTimestamp: number | undefined
}

export interface RorResult {
  sevenDayRor: number
  thirtyDayRor: number
  earliestDayRor: number
  isRorLoading: boolean
}

export const useRor = ({
  vault,
  adapterAddress,
  currencyA,
  currencyB,
  token0USDPrice,
  token1USDPrice,
  startTimestamp,
}: RorProps): RorResult => {
  const chainId = useChainId()

  const { data: rorData, isLoading } = useFetchVaultHistory({ vault, chainId, earliest: startTimestamp })
  const adapterContract = usePositionManagerAdapterContract(adapterAddress ?? '0x')

  const { data: liveUsdPerShare } = useQuery({
    queryKey: ['adapterAddress', adapterAddress, vault, token0USDPrice, token1USDPrice],

    queryFn: async () => {
      if (!token1USDPrice || !token0USDPrice) throw new Error('token Prices needs to be defined')
      const [token0PerShare, token1PerShare] = await adapterContract.read.tokenPerShare()

      const expA = new BigNumber(10).pow(currencyA.decimals)
      const expB = new BigNumber(10).pow(currencyB.decimals)

      const token0USDPerShare = new BigNumber(token0PerShare.toString()).div(expA.multipliedBy(token0USDPrice))
      const token1USDPerShare = new BigNumber(token1PerShare.toString()).div(expB.multipliedBy(token1USDPrice))

      return token0USDPerShare.plus(token1USDPerShare).toNumber()
    },
    enabled: Boolean(adapterContract && token0USDPrice && token1USDPrice),
    initialData: 0,
    refetchInterval: 6000,
    staleTime: 6000,
    gcTime: 6000,
  })

  return useMemo(() => {
    const todayFlooredUnix = floorToUTC00(Date.now())
    const sevenDayFlooredUnix = floorToUTC00(todayFlooredUnix - 7 * ONE_DAY_MILLISECONDS) / 1000
    const thirtyDayFlooredUnix = floorToUTC00(todayFlooredUnix - 30 * ONE_DAY_MILLISECONDS) / 1000

    const allTimeVaultData = rorData[rorData.length - 1]
    const sevenDayVaultData = rorData.find((element) => element.timestamp > sevenDayFlooredUnix)
    const thirtyDayVaultData = rorData.find((element) => element.timestamp > thirtyDayFlooredUnix)

    const sevenDayUsd = new BigNumber(sevenDayVaultData?.usd ?? 0)
    const thirtyDayUsd = new BigNumber(thirtyDayVaultData?.usd ?? 0)
    const earliestDayUsd = new BigNumber(allTimeVaultData?.usd)

    const sevenDayRor = new BigNumber(liveUsdPerShare).minus(sevenDayUsd).div(sevenDayUsd).toNumber()
    const thirtyDayRor = new BigNumber(liveUsdPerShare).minus(thirtyDayUsd).div(thirtyDayUsd).toNumber()
    const earliestDayRor = new BigNumber(liveUsdPerShare).minus(earliestDayUsd).div(earliestDayUsd).toNumber()

    return { sevenDayRor, thirtyDayRor, earliestDayRor, isRorLoading: isLoading }
  }, [rorData, liveUsdPerShare, isLoading])
}
