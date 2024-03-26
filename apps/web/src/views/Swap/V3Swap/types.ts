import { ConfirmModalState } from '@pancakeswap/widgets-internal'
import { MMTradeInfo } from '../MMLinkPools/hooks'
import { MMOrderBookTrade, MMRfqTrade } from '../MMLinkPools/types'

export enum ConfirmModalStateV1 {
  REVIEWING,
  RESETTING_APPROVAL,
  APPROVING_TOKEN,
  APPROVE_PENDING,
  PENDING_CONFIRMATION,
  COMPLETED,
}

export type PendingConfirmModalStateV1 = Extract<
  ConfirmModalStateV1,
  | ConfirmModalStateV1.RESETTING_APPROVAL
  | ConfirmModalStateV1.APPROVING_TOKEN
  | ConfirmModalStateV1.APPROVE_PENDING
  | ConfirmModalStateV1.PENDING_CONFIRMATION
>

export type PendingConfirmModalState = Extract<
  ConfirmModalState,
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.PERMITTING
  | ConfirmModalState.PENDING_CONFIRMATION
  | ConfirmModalState.WRAPPING
  | ConfirmModalState.RESETTING_APPROVAL
>

export type AllowedAllowanceState =
  | ConfirmModalState.RESETTING_APPROVAL
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.PERMITTING

export type MMCommitTrade<T> = {
  isMMBetter: boolean
  mmOrderBookTrade: MMOrderBookTrade<T> | null
  mmRFQTrade: MMRfqTrade<T> | null
  mmQuoteExpiryRemainingSec: number | null
  mmTradeInfo: MMTradeInfo<T> | null
}

export type CommitButtonProps = {
  beforeCommit?: () => void
  afterCommit?: () => void
}
