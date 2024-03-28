import type { PermitTransferFromData } from '@pancakeswap/permit2-sdk'

import type { Address, Hex } from './common'
import type { OrderType } from './orderType'

export type XRequestConfig = {
  routingType: OrderType.DUTCH_LIMIT
  useSyntheticQuotes?: boolean
  swapper?: `0x${string}`
  exclusivityOverrideBps?: number
  startTimeBufferSecs?: number
  auctionPeriodSecs?: number
  deadlineBufferSecs?: number
}

export type DutchOutputPortionInfo = DutchOutput & {
  isPortion?: boolean
}

export type Portion = {
  portionBips: number
  portionAmount: bigint
  portionRecipient: Address
}

export type DutchLimitOrder = {
  quoteId: string // unique identifier for the quote
  requestId: string
  startTimeBufferSecs: number
  auctionPeriodSecs: number
  deadlineBufferSecs: number
  slippageTolerance: string
  permitData: PermitTransferFromData

  portionBips?: number
  portionAmount?: bigint
  portionRecipient?: string

  orderInfo: {
    reactor: Address
    swapper: Address
    nonce: bigint
    deadline: bigint
    additionalValidationContract: Address
    additionalValidationData: Hex
    decayStartTime: bigint
    decayEndTime: bigint
    exclusiveFiller: Address
    exclusivityOverrideBps: bigint
    input: DutchInput
    outputs: DutchOutput[]
  }
  encodedOrder: string
}

// TODO: import from pcsx sdk
export type DutchOutput = {
  readonly token: Address
  readonly startAmount: bigint
  readonly endAmount: bigint
  readonly recipient: Address
}

export type DutchInput = {
  readonly token: Address
  readonly startAmount: bigint
  readonly endAmount: bigint
}
