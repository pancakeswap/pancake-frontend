export enum ConfirmModalState {
  REVIEWING,
  RESETTING_APPROVAL,
  APPROVING_TOKEN,
  APPROVE_PENDING,
  PENDING_CONFIRMATION,
  COMPLETED,
}

export type PendingConfirmModalState = Extract<
  ConfirmModalState,
  | ConfirmModalState.RESETTING_APPROVAL
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.APPROVE_PENDING
  | ConfirmModalState.PENDING_CONFIRMATION
>
