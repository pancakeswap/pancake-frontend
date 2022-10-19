import { Types } from 'aptos'

export const ADDRESS = '0xa1f86fdab3f8c0a7fa0acd7737858dca31bff755f4b33fd87629608818f0327a' as const

export type IfoAddAddressToWhitelistArgs = [string]

export const ifoAddAddressToWhitelist = (
  args: IfoAddAddressToWhitelistArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::add_address_to_whitelist`,
  }
}

export type IfoAddAddressesToWhitelistArgs = [number[] | Uint8Array]

export const ifoAddAddressesToWhitelist = (
  args: IfoAddAddressesToWhitelistArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::add_addresses_to_whitelist`,
  }
}

export type IfoDepositArgs = [bigint | string, bigint | string]

export const ifoDeposit = (args: IfoDepositArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::deposit`,
  }
}

export type IfoFinalWithdrawArgs = [bigint | string, bigint | string]

export const ifoFinalWithdraw = (
  args: IfoFinalWithdrawArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::final_withdraw`,
  }
}

export const ifoGetMaxBufferTime = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: `${ADDRESS}::IFO::get_max_buffer_time`,
  }
}

export const ifoGetNumPools = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: `${ADDRESS}::IFO::get_num_pools`,
  }
}

export type IfoGetPoolInformationArgs = [bigint | string]

export const ifoGetPoolInformation = (
  args: IfoGetPoolInformationArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_pool_information`,
  }
}

export type IfoGetPoolTaxRateOverflowArgs = [bigint | string]

export const ifoGetPoolTaxRateOverflow = (
  args: IfoGetPoolTaxRateOverflowArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_pool_tax_rate_overflow`,
  }
}

export type IfoGetUserAllocationsArgs = [string, number[] | Uint8Array]

export const ifoGetUserAllocations = (
  args: IfoGetUserAllocationsArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_user_allocations`,
  }
}

export type IfoGetUserInfosArgs = [string, number[] | Uint8Array]

export const ifoGetUserInfos = (args: IfoGetUserInfosArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_user_infos`,
  }
}

export type IfoGetUserOfferingAndRefundAmountsArgs = [string, number[] | Uint8Array]

export const ifoGetUserOfferingAndRefundAmounts = (
  args: IfoGetUserOfferingAndRefundAmountsArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_user_offering_and_refund_amounts`,
  }
}

export type IfoGetVestingInformationArgs = [bigint | string]

export const ifoGetVestingInformation = (
  args: IfoGetVestingInformationArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_vesting_information`,
  }
}

export type IfoGetVestingScheduleByAddressAndIndexArgs = [string, bigint | string]

export const ifoGetVestingScheduleByAddressAndIndex = (
  args: IfoGetVestingScheduleByAddressAndIndexArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_vesting_schedule_by_address_and_index`,
  }
}

export type IfoGetVestingScheduleByIdArgs = [number[] | Uint8Array]

export const ifoGetVestingScheduleById = (
  args: IfoGetVestingScheduleByIdArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_vesting_schedule_by_id`,
  }
}

export const ifoGetVestingSchedulesCount = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::IFO::get_vesting_schedules_count`,
  }
}

export type IfoGetVestingSchedulesCountByBeneficiaryArgs = [string]

export const ifoGetVestingSchedulesCountByBeneficiary = (
  args: IfoGetVestingSchedulesCountByBeneficiaryArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_vesting_schedules_count_by_beneficiary`,
  }
}

export const ifoGetVestingSchedulesTotalAmount = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::IFO::get_vesting_schedules_total_amount`,
  }
}

export type IfoGetVetingScheduleIdAtIndexArgs = [bigint | string]

export const ifoGetVetingScheduleIdAtIndex = (
  args: IfoGetVetingScheduleIdAtIndexArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::get_veting_schedule_id_at_index`,
  }
}

export const ifoGetWithdrawableOfferingCoinAmount = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::IFO::get_withdrawable_offering_coin_amount`,
  }
}

export type IfoHarvestPoolArgs = [bigint | string]

export const ifoHarvestPool = (args: IfoHarvestPoolArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::harvest_pool`,
  }
}

export const ifoInit = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: `${ADDRESS}::IFO::init`,
  }
}

export type IfoInitializePoolArgs = [string, bigint | string, bigint | string]

export const ifoInitializePool = (
  args: IfoInitializePoolArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::initialize_pool`,
  }
}

export const ifoIsIfoExist = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::IFO::is_ifo_exist`,
  }
}

export type IfoIsPoolSetArgs = [bigint | string]

export const ifoIsPoolSet = (args: IfoIsPoolSetArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::is_pool_set`,
  }
}

export type IfoIsQualifiedWhitelistArgs = [string]

export const ifoIsQualifiedWhitelist = (
  args: IfoIsQualifiedWhitelistArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::is_qualified_whitelist`,
  }
}

export type IfoReleaseArgs = [number[] | Uint8Array]

export const ifoRelease = (args: IfoReleaseArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::release`,
  }
}

export type IfoRemoveAddressFromWhitelistArgs = [string]

export const ifoRemoveAddressFromWhitelist = (
  args: IfoRemoveAddressFromWhitelistArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::remove_address_from_whitelist`,
  }
}

export type IfoRemoveAddressesFromWhitelistArgs = [number[] | Uint8Array]

export const ifoRemoveAddressesFromWhitelist = (
  args: IfoRemoveAddressesFromWhitelistArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::remove_addresses_from_whitelist`,
  }
}

export const ifoRevoke = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::IFO::revoke`,
  }
}

export type IfoSetMaxBufferTimeArgs = [bigint | string]

export const ifoSetMaxBufferTime = (args: IfoSetMaxBufferTimeArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::IFO::set_max_buffer_time`,
  }
}

export type IfoSetNumPoolsArgs = [bigint | string]

export const ifoSetNumPools = (args: IfoSetNumPoolsArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::IFO::set_num_pools`,
  }
}

export type IfoSetPoolArgs = [
  bigint | string,
  bigint | string,
  bigint | string,
  boolean,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
]

export const ifoSetPool = (args: IfoSetPoolArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::set_pool`,
  }
}

export type IfoUpdateStartAndEndTimeArgs = [bigint | string, bigint | string]

export const ifoUpdateStartAndEndTime = (
  args: IfoUpdateStartAndEndTimeArgs,
  typeArgs: [string, string],
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::IFO::update_start_and_end_time`,
  }
}
