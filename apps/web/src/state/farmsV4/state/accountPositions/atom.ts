import { PositionDetails } from '@pancakeswap/farms'
import { atom } from 'jotai'
import { ChainIdAddressKey } from '../type'

export type AccountPositionMap = {
  [poolKey: ChainIdAddressKey]: PositionInfo
}

export const userPositionsAtom = atom<Record<ChainIdAddressKey, AccountPositionMap>>({})

export const cakePendingRewardsAtom = atom<Record<ChainIdAddressKey, number>>({})

export const priceOfPositionsAtom = atom<Record<ChainIdAddressKey, { priceUSD: string }>>({})

type PositionInfo = {
  chainId: number
  lpAddress: string
  info: V2PositionInfo | V3PositionInfo
}

type V2PositionInfo = {
  pendingCakeReward: bigint
  balance: bigint
}

type V3FarmingPosition = PositionDetails & {
  pendingCakeReward: bigint
}

type V3NonFarmingPosition = PositionDetails

type V3PositionInfo = V3FarmingPosition | V3NonFarmingPosition
