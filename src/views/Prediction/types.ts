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
 * 1. BetBear监听后更新页面
 * 2. Menu居中展示
 * 3. icon上传到uikit-icons
 * 4. comment resolve
 * 5. mobile design
 */
