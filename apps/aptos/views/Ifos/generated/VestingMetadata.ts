/* eslint-disable camelcase */
export interface HoldersVestingCount {
  handle: string
}

export interface VestingSchedules {
  handle: string
}

export interface Data {
  holders_vesting_count: HoldersVestingCount
  vesting_schedule_ids: Uint8Array[]
  vesting_schedules: VestingSchedules
  vesting_total_amount: string
}

export interface RootObject {
  type: string
  data: Data
}
