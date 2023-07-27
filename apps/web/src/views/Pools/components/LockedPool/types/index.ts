import { Dispatch, SetStateAction } from 'react'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { VaultPosition, VaultPositionParams } from 'utils/cakePool'
import { DeserializedLockedVaultUser } from 'state/types'

type VoidFn = () => void

export type PrepConfirmArg = (arg: ValidatorArg) => ValidatorReturn

export interface GenericModalProps {
  onDismiss?: VoidFn
  stakingToken: Token
  currentBalance: BigNumber
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  customLockAmount?: string
  customLockWeekInSeconds?: number
}

export interface ValidatorArg {
  duration: number
}

export interface ValidatorReturn {
  finalLockedAmount?: number
  finalDuration?: number
}

export interface ExtendDurationModal {
  stakingToken: Token
  stakingTokenPrice: number
  currentLockedAmount: number
  onDismiss?: VoidFn
  modalTitle?: string
  currentDuration: number
  currentDurationLeft: number
  currentBalance?: BigNumber
  lockStartTime: string
  isRenew?: boolean
  customLockWeekInSeconds?: number
}

export interface AddButtonProps {
  currentBalance: BigNumber
  stakingToken: Token
  currentLockedAmount: BigNumber
  lockEndTime: string
  lockStartTime: string
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  customLockAmount?: string
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
  stakingTokenPrice: number
  customLockAmount?: string
}

export interface ModalValidator {
  isValidAmount: boolean
  isValidDuration: boolean
  isOverMax: boolean
}

export interface LockedModalBodyPropsType {
  onDismiss?: VoidFn
  stakingToken: Token
  stakingTokenPrice: number
  currentBalance?: BigNumber
  lockedAmount: BigNumber
  editAmountOnly?: React.ReactElement
  prepConfirmArg?: PrepConfirmArg
  currentDuration?: number
  currentDurationLeft?: number
  isRenew?: boolean
  validator?: (arg: ValidatorArg) => ModalValidator
  customOverview?: ({
    isValidDuration,
    duration,
    isMaxSelected,
  }: {
    isValidDuration: boolean
    duration: number
    isMaxSelected?: boolean
  }) => React.ReactElement
  customLockWeekInSeconds?: number
}

export interface ExtendDurationButtonPropsType {
  stakingToken: Token
  stakingTokenPrice: number
  currentLockedAmount: number
  currentBalance?: BigNumber
  lockEndTime: string
  lockStartTime: string
  children: React.ReactNode
  modalTitle?: string
  isRenew?: boolean
  customLockWeekInSeconds?: number
}

export interface AfterLockedActionsPropsType {
  lockEndTime: string
  lockStartTime: string
  currentLockedAmount: number
  stakingToken: Token
  stakingTokenPrice: number
  position: VaultPosition
  isInline?: boolean
  hideConvertToFlexibleButton?: boolean
  customLockWeekInSeconds?: number
}

export interface LockedActionsPropsType extends VaultPositionParams {
  lockStartTime: string
  stakingToken: Token
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
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
  currentDuration?: number
  currentDurationLeft?: number
  isMaxSelected: boolean
  setIsMaxSelected: Dispatch<SetStateAction<boolean>>
}

export interface LockedStakingApyPropsType {
  userData: DeserializedLockedVaultUser
}
