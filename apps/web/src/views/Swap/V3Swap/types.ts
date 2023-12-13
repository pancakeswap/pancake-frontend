export enum ConfirmModalState {
  REVIEWING,
  WRAPPING,
  RESETTING_APPROVAL,
  APPROVING_TOKEN,
  PERMITTING,
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
