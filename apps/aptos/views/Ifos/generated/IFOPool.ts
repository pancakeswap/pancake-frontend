/* eslint-disable camelcase */
export interface Id {
  addr: string
  creation_num: string
}

export interface Guid {
  id: Id
}

export interface CreateVestingScheduleEvents {
  counter: string
  guid: Guid
}

export interface Id2 {
  addr: string
  creation_num: string
}

export interface Guid2 {
  id: Id2
}

export interface DepositEvents {
  counter: string
  guid: Guid2
}

export interface Id3 {
  addr: string
  creation_num: string
}

export interface Guid3 {
  id: Id3
}

export interface HarvestEvents {
  counter: string
  guid: Guid3
}

export interface Id4 {
  addr: string
  creation_num: string
}

export interface Guid4 {
  id: Id4
}

export interface PoolParametersSet {
  counter: string
  guid: Guid4
}

export interface Id5 {
  addr: string
  creation_num: string
}

export interface Guid5 {
  id: Id5
}

export interface ReleasedEvents {
  counter: string
  guid: Guid5
}

export interface UserInfos {
  handle: string
}

export interface RootObject {
  create_vesting_schedule_events: CreateVestingScheduleEvents
  deposit_events: DepositEvents
  harvest_events: HarvestEvents
  has_tax: boolean
  limit_per_user: string
  offering_amount: string
  pid: string
  pool_parameters_set: PoolParametersSet
  raising_amount: string
  released_events: ReleasedEvents
  sum_taxes_overflow: string
  total_amount: string
  user_infos: UserInfos
  vesting_cliff: string
  vesting_duration: string
  vesting_percentage: string
  vesting_slice_period_seconds: string
}
