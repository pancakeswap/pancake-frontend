import { useInterval } from '@pancakeswap/hooks'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { PermitSignature, usePermitAllowance, useUpdatePermitAllowance } from 'hooks/usePermitAllowance'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useHasPendingApproval, useHasPendingRevocation } from 'state/transactions/hooks'
import { useAccount } from 'wagmi'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import useTokenAllowance from './useTokenAllowance'

export enum AllowanceState {
  LOADING,
  REQUIRED,
  ALLOWED,
}

export interface AllowanceRequired {
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
  setSignature: Dispatch<SetStateAction<PermitSignature>>
}

export type Allowance =
  | { state: AllowanceState.LOADING; setSignature: Dispatch<SetStateAction<PermitSignature>> }
  | {
      state: AllowanceState.ALLOWED
      permitSignature?: PermitSignature
      setSignature: Dispatch<SetStateAction<PermitSignature>>
    }
  | AllowanceRequired

const AVERAGE_L1_BLOCK_TIME = 12000

export default function usePermit2Allowance(
  approvalAddress: string,
  amount?: CurrencyAmount<Token>,
  spender?: string,
): Allowance {
  const { address: account } = useAccount()
  const token = amount?.currency

  const { allowance: tokenAllowance } = useTokenAllowance(token, account, approvalAddress)
  const { approveCallback, revokeCallback, approvalState } = useApproveCallback(amount, approvalAddress)

  const isApproved = approvalState === ApprovalState.APPROVED
  const isApprovalLoading = approvalState === ApprovalState.PENDING
  const isApprovalPending = useHasPendingApproval(token?.address, approvalAddress)
  const isRevocationPending = useHasPendingRevocation(token, approvalAddress)

  // Signature and PermitAllowance will expire, so they should be rechecked at an interval.
  // Calculate now such that the signature will still be valid for the submitting block.
  const [now, setNow] = useState(Date.now() + AVERAGE_L1_BLOCK_TIME / 1000)
  useInterval(
    useCallback(() => setNow((Date.now() + AVERAGE_L1_BLOCK_TIME) / 1000), []),
    AVERAGE_L1_BLOCK_TIME,
  )

  const [signature, setSignature] = useState<PermitSignature>()
  const isSigned = useMemo(() => {
    if (!amount || !signature) return false
    // @ts-ignore
    return signature.details.token === token?.address && signature.spender === spender && signature.sigDeadline >= now
  }, [amount, now, signature, spender, token?.address])

  const { permitAllowance, expiration: permitExpiration, nonce } = usePermitAllowance(token, account, spender)
  const updatePermitAllowance = useUpdatePermitAllowance(token, spender, nonce, setSignature)

  const isPermitted = useMemo(() => {
    if (!amount || !permitAllowance || !permitExpiration) return false
    return (permitAllowance.greaterThan(amount) || permitAllowance.equalTo(amount)) && permitExpiration >= now
  }, [amount, now, permitAllowance, permitExpiration])

  const shouldRequestSignature = !(isPermitted || isSigned)

  return useMemo(() => {
    if (token) {
      if (!tokenAllowance || !permitAllowance) {
        return { state: AllowanceState.LOADING, setSignature }
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
        }
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
        }
      }
    }
    return {
      token,
      state: AllowanceState.ALLOWED,
      permitSignature: !isPermitted && isSigned ? signature : undefined,
      needsSetupApproval: false,
      needsPermitSignature: false,
      setSignature,
    }
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
