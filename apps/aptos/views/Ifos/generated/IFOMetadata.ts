/* eslint-disable camelcase */
export interface Id {
  addr: string
  creation_num: string
}

export interface Guid {
  id: Id
}

export interface AdminWithdralEvents {
  counter: string
  guid: Guid
}

export interface OfferingCoinStore {
  value: string
}

export interface RaisingCoinStore {
  value: string
}

export interface Id2 {
  addr: string
  creation_num: string
}

export interface Guid2 {
  id: Id2
}

export interface RevokedEvents {
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

export interface StartAndEndTimeSet {
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

export interface WhitelistedAddressAddedEvents {
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

export interface WhitelistedAddressRemovedEvents {
  counter: string
  guid: Guid5
}

export interface Whitelist {
  white_list: any[]
  whitelisted_address_added_events: WhitelistedAddressAddedEvents
  whitelisted_address_removed_events: WhitelistedAddressRemovedEvents
}

export interface Data {
  admin_withdral_events: AdminWithdralEvents
  end_time: string
  max_buffer_time: string
  offering_coin_store: OfferingCoinStore
  owner: string
  raising_coin_store: RaisingCoinStore
  revoked_events: RevokedEvents
  start_and_end_time_set: StartAndEndTimeSet
  start_time: string
  total_coins_offered: string
  vesting_revoked: boolean
  vesting_start_time: string
  whitelist: Whitelist
}

export interface RootObject {
  type: string
  data: Data
}
