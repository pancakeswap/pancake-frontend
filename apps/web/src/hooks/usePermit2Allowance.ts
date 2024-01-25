import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { usePermitAllowance, useUpdatePermitAllowance } from 'hooks/usePermitAllowance'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useHasPendingApproval, useHasPendingRevocation } from 'state/transactions/hooks'
import { Address, useAccount } from 'wagmi'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import useTokenAllowance from './useTokenAllowance'

export enum AllowanceState {
  LOADING,
  REQUIRED,
  ALLOWED,
}

export interface BaseAllowance {
  state: AllowanceState
  setSignature: Dispatch<SetStateAction<Permit2Signature | undefined>>
  [k: string]: unknown
}

export interface AllowanceLoading extends BaseAllowance {
  state: AllowanceState.LOADING
}
export interface AllowanceAllowed extends BaseAllowance {
  state: AllowanceState.ALLOWED
  permitSignature?: Permit2Signature
}

export interface AllowanceRequired extends BaseAllowance {
  isRevocationPending: boolean
  state: AllowanceState.REQUIRED
  token: Token
  isApprovalLoading: boolean
  isApprovalPending: boolean
  approve: any
  permit: () => Promise<void>
  revoke: any
  needsSetupApproval: boolean
  needsPermitSignature: boolean
  allowedAmount: CurrencyAmount<Token>
}

export type Allowance = AllowanceLoading | AllowanceAllowed | AllowanceRequired

export default function usePermit2Allowance(
  approvalAddress: string | undefined,
  amount?: CurrencyAmount<Token>,
  spender?: Address,
): Allowance {
  const { address: account } = useAccount()
  const token = amount?.currency

  const { allowance: tokenAllowance } = useTokenAllowance(token, account, approvalAddress)
  const { approveCallback, revokeCallback, approvalState } = useApproveCallback(amount, approvalAddress)

  const isApproved = approvalState === ApprovalState.APPROVED
  const isApprovalLoading = approvalState === ApprovalState.PENDING
  const isApprovalPending = useHasPendingApproval(token?.address, approvalAddress)
  const isRevocationPending = useHasPendingRevocation(token, approvalAddress)
  const now = useCurrentBlockTimestamp() ?? 0n

  const [signature, setSignature] = useState<Permit2Signature>()
  const isSigned = useMemo(() => {
    if (!amount || !signature) return false
    return (
      signature.details.token === token?.address &&
      signature.spender === spender &&
      BigInt(signature.sigDeadline) >= now
    )
  }, [amount, now, signature, spender, token?.address])

  const { permitAllowance, expiration: permitExpiration, nonce } = usePermitAllowance(token, account, spender)
  const updatePermitAllowance = useUpdatePermitAllowance(token, spender, nonce, setSignature)

  const isPermitted = useMemo(() => {
    if (!amount || !permitAllowance || !permitExpiration) return false
    return (permitAllowance.greaterThan(amount) || permitAllowance.equalTo(amount)) && permitExpiration >= now
  }, [amount, now, permitAllowance, permitExpiration])

  const shouldRequestSignature = !(isPermitted || isSigned)

  return useMemo((): Allowance => {
    if (token) {
      if (!tokenAllowance || !permitAllowance) {
        return { state: AllowanceState.LOADING, setSignature } satisfies AllowanceLoading
      }
      if (shouldRequestSignature) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading: false,
          isApprovalPending,
          isRevocationPending,
          approve: approveCallback,
          permit: updatePermitAllowance,
          revoke: revokeCallback,
          needsSetupApproval: !isApproved,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance,
          setSignature,
        } satisfies AllowanceRequired
      }
      if (!isApproved) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading,
          isApprovalPending,
          isRevocationPending,
          approve: approveCallback,
          permit: updatePermitAllowance,
          revoke: revokeCallback,
          needsSetupApproval: true,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance,
          setSignature,
        } satisfies AllowanceRequired
      }
    }
    return {
      token,
      state: AllowanceState.ALLOWED,
      permitSignature: !isPermitted && isSigned ? signature : undefined,
      needsSetupApproval: false,
      needsPermitSignature: false,
      setSignature,
    } satisfies BaseAllowance
  }, [
    approveCallback,
    isApprovalLoading,
    isApprovalPending,
    isApproved,
    isPermitted,
    isSigned,
    updatePermitAllowance,
    permitAllowance,
    revokeCallback,
    shouldRequestSignature,
    signature,
    token,
    tokenAllowance,
    isRevocationPending,
  ])
}
