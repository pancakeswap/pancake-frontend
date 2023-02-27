/* eslint-disable camelcase */

export interface FarmResourcePoolInfo {
  acc_cake_per_share: string
  alloc_point: string
  is_regular: boolean
  last_reward_timestamp: string
  total_amount: string
}

export interface FarmResourceUserInfo {
  length: string
  inner: {
    handle: string
  }
}

export interface MapFarmResource {
  pid?: number
  admin: string
  cake_per_second: string
  cake_rate_to_regular: string
  cake_rate_to_special: string
  lps: Array<string>
  pool_info: FarmResourcePoolInfo[]
  signer_cap: {
    account: string
  }
  total_regular_alloc_point: string
  total_special_alloc_point: string
  user_info: FarmResourceUserInfo[]
  singleUserInfo?: string
  end_timestamp: string
  last_upkeep_timestamp: string
}

export interface FarmResource {
  type: string
  data: MapFarmResource
}

export interface FarmUserInfoResponse {
  amount: string
  reward_debt: string
}

export interface FarmUserInfoResource {
  pid_to_user_info: {
    inner: {
      handle: string
    }
    length: string
  }
  pids: string[]
}
