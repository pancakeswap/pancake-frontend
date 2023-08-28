export enum ConfirmModalState {
  REVIEWING,
  APPROVING_TOKEN,
  APPROVE_PENDING,
  PENDING_CONFIRMATION,
  COMPLETED,
}

export type PendingConfirmModalState = Extract<
  ConfirmModalState,
  ConfirmModalState.APPROVING_TOKEN | ConfirmModalState.APPROVE_PENDING | ConfirmModalState.PENDING_CONFIRMATION
>
