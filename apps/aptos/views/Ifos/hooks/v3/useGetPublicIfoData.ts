/* eslint-disable camelcase */
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, IfoStatus } from 'config/constants/types'
import { useCakePrice } from 'hooks/useStablePrice'
import { useState, useCallback, useMemo } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_METADATA } from 'views/Ifos/constants'
import { RootObject as IFOPool } from 'views/Ifos/generated/IFOPool'
import { PoolCharacteristics, PublicIfoData, VestingInformation } from '../../types'
import { getStatus } from '../helpers'
import { useIfoPool } from '../useIfoPool'
import { useIfoResources } from '../useIfoResources'

const formatVestingInfo = (pool: IFOPool): VestingInformation => ({
  percentage: pool ? +pool.vesting_percentage : 0,
  cliff: pool ? +pool.vesting_cliff : 0,
  duration: pool ? +pool.vesting_duration : 0,
  slicePeriodSeconds: pool ? +pool.vesting_slice_period_seconds : 0,
})

// TODO: Can pool be undefined?
const formatPool = (pool: IFOPool): PoolCharacteristics => ({
  raisingAmountPool: pool ? new BigNumber(pool.raising_amount.toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool.offering_amount.toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool.limit_per_user.toString()) : BIG_ZERO,
  // hasTax: pool ? pool.has_tax : false,
  taxRate: 0, // TODO: Aptos. Tax rate currently comes from a view function.
  totalAmountPool: pool ? new BigNumber(pool.total_amount.toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool.sum_taxes_overflow.toString()) : BIG_ZERO,
  vestingInformation: pool ? formatVestingInfo(pool) : undefined,
})

/**
 * Gets all public data of an IFO
 */
export const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { releaseTime } = ifo
  const { data: cakePrice } = useCakePrice()
  // const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  // const currencyPriceInUSD = ifo.currency === bscTokens.cake ? cakePriceUsd : lpTokenPriceInUsd
  const currencyPriceInUSD = useMemo(() => new BigNumber(cakePrice), [cakePrice])

  const [state, setState] = useState<Omit<PublicIfoData, 'currencyPriceInUSD' | 'fetchIfoData'>>({
    isInitialized: false,
    status: 'idle' as IfoStatus,
    timeRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    startTime: 0,
    endTime: 0,
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
      vestingInformation: {
        percentage: 0,
        cliff: 0,
        duration: 0,
        slicePeriodSeconds: 0,
      },
    },
    vestingStartTime: 0,
  })

  const resources = useIfoResources()
  const pool = useIfoPool()

  const fetchIfoData = useCallback(
    async (_currentBlock: number) => {
      if (!pool.data || !resources.data || !resources.data[IFO_RESOURCE_ACCOUNT_TYPE_METADATA]) {
        return
      }

      const { start_time, end_time, vesting_start_time } = resources.data[IFO_RESOURCE_ACCOUNT_TYPE_METADATA].data
      const startTime = +start_time
      const endTime = +end_time
      const vestingStartTime = +vesting_start_time

      const poolUnlimited = formatPool(pool.data)

      const currentTime = Date.now() / 1000

      const status = getStatus(currentTime, startTime, endTime)
      const totalTime = endTime - startTime
      const timeRemaining = endTime - currentTime

      const progress =
        currentTime > startTime
          ? ((currentTime - startTime) / totalTime) * 100
          : ((currentTime - releaseTime) / (startTime - releaseTime)) * 100

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        secondsUntilEnd: endTime - currentTime,
        secondsUntilStart: startTime - currentTime,
        poolUnlimited,
        status,
        progress,
        timeRemaining,
        startTime,
        endTime,
        vestingStartTime,
      }))
    },
    [pool, releaseTime, resources],
  )

  return { ...state, currencyPriceInUSD, fetchIfoData }
}
