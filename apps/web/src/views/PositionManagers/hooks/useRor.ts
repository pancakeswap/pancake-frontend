/* eslint-disable no-param-reassign */
import type { Currency } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { usePositionManagerAdapterContract } from 'hooks/useContract'
import { useMemo } from 'react'
import type { Address } from 'viem'
import type { VaultHistorySnapshots } from './useFetchVaultHistory'

interface RorProps {
  vault: Address | undefined
  adapterAddress: Address | undefined
  vaultHistorySnapshots: VaultHistorySnapshots
  currencyA: Currency
  currencyB: Currency
  token0USDPrice: number | undefined
  token1USDPrice: number | undefined
}

export interface RorResult {
  sevenDayRor: number | undefined
  thirtyDayRor: number | undefined
  earliestDayRor: number | undefined
}

export const useRor = ({
  vault,
  adapterAddress,
  currencyA,
  currencyB,
  token0USDPrice,
  token1USDPrice,
  vaultHistorySnapshots,
}: RorProps): RorResult | undefined => {
  const adapterContract = usePositionManagerAdapterContract(adapterAddress ?? '0x')

  const { data: liveUsdPerShare } = useQuery({
    queryKey: ['adapterAddress', adapterAddress, vault, token0USDPrice, token1USDPrice],
    queryFn: async () => {
      if (!token1USDPrice || !token0USDPrice) throw new Error('token Prices needs to be defined')
      const [token0PerShare, token1PerShare] = await adapterContract.read.tokenPerShare()

      const expA = new BigNumber(10).pow(currencyA.decimals)
      const expB = new BigNumber(10).pow(currencyB.decimals)

      const token0USDPerShare = new BigNumber(token0PerShare.toString()).div(expA).multipliedBy(token0USDPrice)
      const token1USDPerShare = new BigNumber(token1PerShare.toString()).div(expB).multipliedBy(token1USDPrice)

      return token0USDPerShare.plus(token1USDPerShare).toNumber()
    },
    enabled: Boolean(adapterContract && token0USDPrice && token1USDPrice),
    initialData: 0,
    refetchInterval: 10000,
  })

  return useMemo(() => {
    const vaultRorData = vaultHistorySnapshots.rorData.filter((vaultData) => {
      return vaultData.vault === vault?.toLowerCase()
    })
    if (vaultRorData.length === 0) return undefined

    const sevenDayUsd = new BigNumber(vaultRorData[0].usd)
    const thirtyDayUsd = new BigNumber(vaultRorData[1].usd)
    const earliestDayUsd = new BigNumber(vaultRorData[2].usd)

    const sevenDayDifference = new BigNumber(liveUsdPerShare).minus(sevenDayUsd)
    const thrityDayDifference = new BigNumber(liveUsdPerShare).minus(thirtyDayUsd)
    const earliestDayDifference = new BigNumber(liveUsdPerShare).minus(earliestDayUsd)

    const sevenDayRor = sevenDayDifference.div(sevenDayUsd).multipliedBy(100).toNumber()
    const thirtyDayRor = thrityDayDifference.div(thirtyDayUsd).multipliedBy(100).toNumber()
    const earliestDayRor = earliestDayDifference.div(earliestDayUsd).multipliedBy(100).toNumber()

    const validSevenDayRor = Number.isFinite(sevenDayRor) ? sevenDayRor : undefined
    const validThirtyDayRor = Number.isFinite(thirtyDayRor) ? thirtyDayRor : undefined
    const validEarliestDayRor = Number.isFinite(earliestDayRor) ? earliestDayRor : undefined

    return { sevenDayRor: validSevenDayRor, thirtyDayRor: validThirtyDayRor, earliestDayRor: validEarliestDayRor }
  }, [vaultHistorySnapshots, liveUsdPerShare, vault])
}
