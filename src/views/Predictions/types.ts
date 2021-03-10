export interface RoundResponse {
  epoch: number
  startBlock: number
  lockBlock: number
  endBlock: number
  lockPrice: number
  closePrice: number
  totalAmount: number
  bullAmount: number
  bearAmount: number
  rewardBaseCalAmount: number
  rewardAmount: number
  oracleCalled: boolean
}
