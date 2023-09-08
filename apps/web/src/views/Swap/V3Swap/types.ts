export enum ConfirmModalState {
  REVIEWING,
  RESETTING_USDT,
  APPROVING_TOKEN,
  APPROVE_PENDING,
  PENDING_CONFIRMATION,
  COMPLETED,
}

export type PendingConfirmModalState = Extract<
  ConfirmModalState,
  | ConfirmModalState.RESETTING_USDT
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.APPROVE_PENDING
  | ConfirmModalState.PENDING_CONFIRMATION
>
