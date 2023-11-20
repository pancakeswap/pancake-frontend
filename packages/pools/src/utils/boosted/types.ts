import { Address } from 'viem'

export enum BoosterType {
  ALP,
}

export type BoosterConfig = {
  boosterType: BoosterType
  contractAddress: Address
  tooltipsText?: string
}
