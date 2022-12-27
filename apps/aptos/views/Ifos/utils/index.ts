/* eslint-disable camelcase */
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { RootObject as IFOMetadata } from 'views/Ifos/generated/IFOMetadata'
import { RootObject as IFOPool } from 'views/Ifos/generated/IFOPool'
import { RootObject as VestingSchedule } from 'views/Ifos/generated/VestingSchedule'
import _toNumber from 'lodash/toNumber'
import { calculateTaxOverflow, computeVestingScheduleId, getUserAllocation } from './utils'

export * from './utils'

const PRECISION = '1000000000000'

/**
 * get_pool_tax_rate_overflow
 */
export const getPoolTaxRateOverflow = (
  pid: number,
  data: {
    ifo_pool: IFOPool
  },
): BigNumber => {
  if (data.ifo_pool.has_tax) {
    return calculateTaxOverflow(new BigNumber(data.ifo_pool.total_amount), new BigNumber(data.ifo_pool.raising_amount))
  }

  return BIG_ZERO
}

/**
 * compute_offering_and_refund_amount
 */
export const computeOfferingAndRefundAmount = (amount: string, ifo_pool: IFOPool) => {
  let offering_amount: BigNumber
  let refunding_amount: BigNumber
  let tax_amount: BigNumber = BIG_ZERO

  const totalAmount = _toNumber(ifo_pool.total_amount)
  const raisingAmount = _toNumber(ifo_pool.raising_amount)

  if (totalAmount > raisingAmount) {
    const allocation = getUserAllocation(new BigNumber(totalAmount), new BigNumber(amount))

    offering_amount = new BigNumber(ifo_pool.offering_amount).times(allocation.div(PRECISION))
    const payment = new BigNumber(raisingAmount).times(allocation.div(PRECISION))
    refunding_amount = new BigNumber(amount).minus(payment)
    if (ifo_pool.has_tax) {
      const tax_overflow = calculateTaxOverflow(new BigNumber(totalAmount), new BigNumber(raisingAmount))

      tax_amount = refunding_amount.times(tax_overflow.div(PRECISION))
      refunding_amount = refunding_amount.minus(tax_amount)
    }
  } else {
    refunding_amount = BIG_ZERO
    offering_amount = new BigNumber(amount).times(ifo_pool.offering_amount).div(raisingAmount)
  }

  return {
    offering_amount,
    refunding_amount,
    tax_amount,
  }
}

/**
 * compute_release_amount
 */
export const computeReleaseAmount = (
  ifo_metadata: IFOMetadata['data'],
  ifo_pool: IFOPool,
  vesting_schedule: VestingSchedule,
): BigNumber => {
  const current_time = Date.now() / 1000

  if (current_time < +ifo_metadata.vesting_start_time + +ifo_pool.vesting_cliff) {
    return BIG_ZERO
  }
  if (current_time >= +ifo_metadata.vesting_start_time + +ifo_pool.vesting_duration || ifo_metadata.vesting_revoked) {
    return new BigNumber(vesting_schedule.amount_total).minus(vesting_schedule.amount_released)
  }

  const time_since_start = current_time - +ifo_metadata.vesting_start_time
  const seconds_per_slice = +ifo_pool.vesting_slice_period_seconds
  const vested_slice_periods = Math.floor(time_since_start / seconds_per_slice)

  const vested_seconds = vested_slice_periods * seconds_per_slice

  const vested_amount = new BigNumber(vesting_schedule.amount_total)
    .times(vested_seconds)
    .div(ifo_pool.vesting_duration)
    .toFixed(0)

  return new BigNumber(vested_amount).minus(vesting_schedule.amount_released)
}

/**
 * compute_next_vesting_schedule_id_for_holder_and_pid
 */
export const computeNextVestingScheduleIdForHolderAndPid = (
  holder: string,
  pid: string,
  data: {
    vesting_schedule: VestingSchedule
  },
) => {
  if (data.vesting_schedule.pid === pid) {
    return computeVestingScheduleId(holder, 0)
  }
  return computeVestingScheduleId(holder, 1)
}
