import { Address } from 'viem'
import { Percent } from '@pancakeswap/swap-sdk-core'

export enum BoosterType {
  ALP,
}

export type BoosterConfig = {
  type: BoosterType
  contractAddress: Address
}

export type Booster = BoosterConfig & {
  apr: Percent
}
