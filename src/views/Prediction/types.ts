export enum STATUS {
  'EXPIRED' = 'EXPIRED',
  'LIVE' = 'LIVE',
  'COMING' = 'COMING',
}

export enum DIRECTION {
  'BULL' = 'BULL',
  'BEAR' = 'BEAR',
}

export interface IRound {
  epoch: number
  status: STATUS
  lockPrice: string
  endPrice: string
  totalAmount: string
  bullAmount: string
  bearAmount: string
  rewardBaseCalAmount: string
  rewardAmount: string
  userAmount: string
  userDirection: DIRECTION
  claimed: boolean
  claimable: boolean
}

export interface IBetInfo {
  direction: boolean
  amount: string
  claimed: boolean
  claimable?: boolean
}

/**   pre+3 current next+1
 * 1. BetBear event监听后拿到的参数
 * 2. stake dialog何时关闭
 * 3. testnet连接问题
 */
