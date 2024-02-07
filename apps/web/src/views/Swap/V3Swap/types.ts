import { ConfirmModalState } from '@pancakeswap/widgets-internal'

export enum ConfirmModalStateV1 {
  REVIEWING,
  RESETTING_APPROVAL,
  APPROVING_TOKEN,
  APPROVE_PENDING,
  PENDING_CONFIRMATION,
  COMPLETED,
}

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
