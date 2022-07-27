import { Dispatch, SetStateAction } from 'react'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { VaultPosition, VaultPositionParams } from 'utils/cakePool'
import { DeserializedLockedVaultUser } from 'state/types'

type VoidFn = () => void

export type PrepConfirmArg = (arg: ValidatorArg) => ValiratorReturn

export interface GenericModalProps {
  onDismiss?: VoidFn
  stakingToken: Token
  currentBalance: BigNumber
  stakingTokenBalance: BigNumber
}

export interface ValidatorArg {
  duration: number
}

export interface ValiratorReturn {
  finalLockedAmount?: number
  finalDuration?: number
}

export interface ExtendDurationModal {
  stakingToken: Token
  currentLockedAmount: number
  onDismiss?: VoidFn
  modalTitle?: string
  currentDuration: number
  currentBalance?: BigNumber
  extendLockedPosition?: boolean
  lockStartTime: string
  lockEndTime: string
}

export interface AddButtonProps {
  currentBalance: BigNumber
  stakingToken: Token
  currentLockedAmount: BigNumber
  lockEndTime: string
  lockStartTime: string
  stakingTokenBalance: BigNumber
}

export interface OverviewPropsType {
  usdValueStaked: number
  lockedAmount: number
  openCalculator: () => void
  duration: number
  isValidDuration: boolean
  newDuration?: number
  newLockedAmount?: number
  lockStartTime?: string
  lockEndTime?: string
  showLockWarning?: boolean
  ceiling?: BigNumber
}

export interface AddAmountModalProps {
  onDismiss?: VoidFn
  stakingToken: Token
  currentBalance: BigNumber
  currentLockedAmount: BigNumber
  lockStartTime?: string
  lockEndTime?: string
  stakingTokenBalance: BigNumber
}

export interface ModalValidator {
  isValidAmount: boolean
  isValidDuration: boolean
  isOverMax: boolean
  maxAvailableDuration: number
  currentDuration?: number
  currentDurationLeft?: number
}

export interface LockedModalBodyPropsType {
  onDismiss?: VoidFn
  stakingToken: Token
  currentBalance?: BigNumber
  extendLockedPosition?: boolean
  lockedAmount: BigNumber
  editAmountOnly?: React.ReactElement
  prepConfirmArg?: PrepConfirmArg
  validator?: (arg: ValidatorArg) => ModalValidator
  customOverview?: ({
    isValidDuration,
    duration,
    updatedLockStartTime,
    updatedNewDuration,
  }: {
    isValidDuration: boolean
    duration: number
    updatedLockStartTime: number
    updatedNewDuration: number
  }) => React.ReactElement
}

export interface ExtendDurationButtonPropsType {
  stakingToken: Token
  currentLockedAmount: number
  currentBalance?: BigNumber
  extendLockedPosition?: boolean
  lockEndTime: string
  lockStartTime: string
  children: React.ReactNode
  modalTitle?: string
}

export interface AfterLockedActionsPropsType {
  lockEndTime: string
  lockStartTime: string
  currentLockedAmount: number
  stakingToken: Token
  position: VaultPosition
  isInline?: boolean
}

export interface LockedActionsPropsType extends VaultPositionParams {
  lockStartTime: string
  stakingToken: Token
  stakingTokenBalance: BigNumber
  lockedAmount: BigNumber
}

export interface StaticAmountPropsType {
  stakingSymbol: string
  stakingAddress: string
  lockedAmount: number
  usdValueStaked: number
}

export interface LockDurationFieldPropsType {
  duration: number
  setDuration: Dispatch<SetStateAction<number>>
  isOverMax: boolean
  maxAvailableDuration: number
  extendLockedPosition?: boolean
}

export interface LockedStakingApyPropsType {
  stakingToken: Token
  stakingTokenBalance: BigNumber
  userData: DeserializedLockedVaultUser
}
