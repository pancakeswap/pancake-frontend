import { PositionDetails } from 'hooks/v3/types'
import { FarmV3DataWithPrice } from '@pancakeswap/farms'
import { BigNumber } from '@ethersproject/bignumber'

export type IPendingCakeByTokenId = Record<string, BigNumber>

export interface FarmV3DataWithPriceAndUserInfo extends FarmV3DataWithPrice {
  unstakedPositions: PositionDetails[]
  stakedPositions: PositionDetails[]
  pendingCakeByTokenIds: IPendingCakeByTokenId
}
