/* eslint-disable no-param-reassign */
import { Currency } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { usePositionManagerAdapterContract } from 'hooks/useContract'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { RorUSDMap, VaultHistorySnapshots } from './useFetchVaultHistory'

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
  sevenDayRor: number
  thirtyDayRor: number
  earliestDayRor: number
}

export const useRor = ({
  vault,
  adapterAddress,
  currencyA,
  currencyB,
  token0USDPrice,
  token1USDPrice,
  vaultHistorySnapshots,
}: RorProps): RorResult => {
  const adapterContract = usePositionManagerAdapterContract(adapterAddress ?? '0x')

  const vaultSnapshots = useMemo((): RorUSDMap => {
    const vaultRorData = vaultHistorySnapshots.rorData.filter((vaultData) => {
      return vaultData.vault === vault?.toLowerCase()
    })
    return vaultRorData.reduce((vaultUsdValues, item) => {
      vaultUsdValues[item.period] = item.usd
      return vaultUsdValues
    }, {} as RorUSDMap)
  }, [vaultHistorySnapshots, vault])

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
    refetchInterval: 10000,
  })

  return useMemo(() => {
    const sevenDayUsd = new BigNumber(vaultSnapshots?.SEVENTH_DAY ?? 0)
    const thirtyDayUsd = new BigNumber(vaultSnapshots?.THIRTY_DAY ?? 0)
    const earliestDayUsd = new BigNumber(vaultSnapshots?.INCEPTION_DAY)

    const sevenDayRor = new BigNumber(liveUsdPerShare).minus(sevenDayUsd).div(sevenDayUsd).toNumber()
    const thirtyDayRor = new BigNumber(liveUsdPerShare).minus(thirtyDayUsd).div(thirtyDayUsd).toNumber()
    const earliestDayRor = new BigNumber(liveUsdPerShare).minus(earliestDayUsd).div(earliestDayUsd).toNumber()

    return { sevenDayRor, thirtyDayRor, earliestDayRor }
  }, [vaultSnapshots, liveUsdPerShare])
}
