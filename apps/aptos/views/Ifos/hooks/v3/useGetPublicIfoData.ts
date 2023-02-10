/* eslint-disable camelcase */
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo } from 'config/constants/types'
import { useCakePrice } from 'hooks/useStablePrice'
import { useMemo } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_METADATA, IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from 'views/Ifos/constants'
import { RootObject as IFOPool } from 'views/Ifos/generated/IFOPool'
import { getPoolTaxRateOverflow } from 'views/Ifos/utils'
import { PoolCharacteristics, PublicIfoData, VestingInformation } from '../../types'
import { useIfoResources } from '../useIfoResources'

const formatVestingInfo = (pool: IFOPool): VestingInformation => ({
  percentage: pool ? +pool.vesting_percentage : 0,
  cliff: pool ? +pool.vesting_cliff : 0,
  duration: pool ? +pool.vesting_duration : 0,
  slicePeriodSeconds: pool ? +pool.vesting_slice_period_seconds : 0,
})

const TAX_PRECISION = new BigNumber(10000000000)

const formatPool = (pool: IFOPool): PoolCharacteristics => ({
  raisingAmountPool: pool ? new BigNumber(pool.raising_amount.toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool.offering_amount.toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool.limit_per_user.toString()) : BIG_ZERO,
  taxRate: getPoolTaxRateOverflow(+pool.pid, { ifo_pool: pool }).div(TAX_PRECISION).toNumber(),
  totalAmountPool: pool ? new BigNumber(pool.total_amount.toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool.sum_taxes_overflow.toString()) : BIG_ZERO,
  vestingInformation: pool ? formatVestingInfo(pool) : undefined,
})

const initState = {
  isInitialized: false,
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
}

/**
 * Gets all public data of an IFO
 */
export const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const resources = useIfoResources(ifo)

  // TODO: Currently we only support CAKE Price
  const { data: cakePrice } = useCakePrice()

  const currencyPriceInUSD = useMemo(() => new BigNumber(cakePrice), [cakePrice])

  const finalState = useMemo(() => {
    if (
      resources?.isLoading ||
      !resources.data ||
      !resources.data[IFO_RESOURCE_ACCOUNT_TYPE_METADATA] ||
      !resources.data[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?.data
    ) {
      return initState
    }

    const { start_time, end_time, vesting_start_time } = resources.data[IFO_RESOURCE_ACCOUNT_TYPE_METADATA].data

    const dataPool = resources.data[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?.data as unknown as IFOPool

    const startTime = +start_time
    const endTime = +end_time
    const vestingStartTime = +vesting_start_time

    const poolUnlimited = formatPool(dataPool)

    return {
      ...initState,
      isInitialized: true,
      poolUnlimited,
      startTime,
      endTime,
      vestingStartTime,
    }
  }, [resources.data, resources?.isLoading])

  return { ...finalState, currencyPriceInUSD }
}
