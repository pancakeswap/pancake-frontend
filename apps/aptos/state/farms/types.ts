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

export interface FarmResource {
  type: string
  data: {
    admin: string
    cake_per_second: string
    cake_rate_to_regular: string
    cake_rate_to_special: string
    lp: Array<string>
    pool_info: FarmResourcePoolInfo[]
    signer_cap: {
      account: string
    }
    total_regular_alloc_point: string
    total_special_alloc_point: string
    user_info: FarmResourceUserInfo[]
  }
}
