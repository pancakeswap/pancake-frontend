/* eslint-disable camelcase */
export interface Resource {
  type: string
  data: Record<string, unknown>
}

export interface PoolResource {
  type: string
  data: {
    end_timestamp: string
    start_timestamp: string
    reward_per_second: string
    pool_limit_per_user: string
    total_staked_token: string
  }
}
