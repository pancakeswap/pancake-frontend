import { useInterval } from '@pancakeswap/hooks'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { PERMIT2_ADDRESS } from '@pancakeswap/permit2-sdk'
import { PermitSignature, usePermitAllowance, useUpdatePermitAllowance } from 'hooks/usePermitAllowance'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHasPendingApproval } from 'state/transactions/hooks'
import { useAccount } from 'wagmi'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import useTokenAllowance from './useTokenAllowance'

export enum AllowanceState {
  LOADING,
  REQUIRED,
  ALLOWED,
}

export interface AllowanceRequired {
  state: AllowanceState.REQUIRED
  token: Token
  isApprovalLoading: boolean
  isApprovalPending: boolean
//   isRevocationPending: boolean
  approveAndPermit: () => Promise<void>
  approve: () => Promise<void>
  permit: () => Promise<void>
  revoke: () => Promise<void>
  needsSetupApproval: boolean
  needsPermitSignature: boolean
  allowedAmount: CurrencyAmount<Token>
}

export type Allowance =
  | { state: AllowanceState.LOADING }
  | {
      state: AllowanceState.ALLOWED
      permitSignature?: PermitSignature
    }
  | AllowanceRequired

const AVERAGE_L1_BLOCK_TIME = 12000

export default function usePermit2Allowance(
  amount?: CurrencyAmount<Token>,
  spender?: string,
): Allowance {
 const { address: account } = useAccount()
  const token = amount?.currency

  const { allowance: tokenAllowance } = useTokenAllowance(token ?? undefined, account ?? undefined, PERMIT2_ADDRESS)
  const { approveCallback, revokeCallback, approvalState } = useApproveCallback(amount, PERMIT2_ADDRESS)
  const isApproved = approvalState === ApprovalState.APPROVED
//   console.log('isapproved', isApproved, tokenAllowance?.numerator)

  // Marks approval as loading from the time it is submitted (pending), until it has confirmed and another block synced.
  // This avoids re-prompting the user for an already-submitted but not-yet-observed approval, by marking it loading
  // until it has been re-observed. It wll sync immediately, because confirmation fast-forwards the block number.
  const isApprovalLoading = approvalState === ApprovalState.PENDING
  const isApprovalPending = useHasPendingApproval(token?.address, PERMIT2_ADDRESS)
//   const isRevocationPending = useHasPendingRevocation(token, PERMIT2_ADDRESS)

//   useEffect(() => {
//     if (isApprovalPending) {
//       setApprovalState(ApprovalState.PENDING)
//     } else {
//       setApprovalState((state) => {
//         if (state === ApprovalState.PENDING) {
//           return ApprovalState.SYNCING
//         } if (state === ApprovalState.SYNCING) {
//           return ApprovalState.SYNCED
//         }
//         return state
//       })
//     }
//   }, [isApprovalPending])

  // Signature and PermitAllowance will expire, so they should be rechecked at an interval.
  // Calculate now such that the signature will still be valid for the submitting block.
  const [now, setNow] = useState(Date.now() + AVERAGE_L1_BLOCK_TIME / 1000)
  useInterval(
    useCallback(() => setNow((Date.now() + AVERAGE_L1_BLOCK_TIME) / 1000), []),
    AVERAGE_L1_BLOCK_TIME
  )

  const [signature, setSignature] = useState<PermitSignature>()
  const isSigned = useMemo(() => {
    if (!amount || !signature) return false
    return signature.details.token === token?.address && signature.spender === spender && signature.sigDeadline >= now
  }, [amount, now, signature, spender, token?.address])

  const { permitAllowance, expiration: permitExpiration, nonce } = usePermitAllowance(token, account, spender)
  const updatePermitAllowance = useUpdatePermitAllowance(token ?? undefined, spender, nonce, setSignature)
  const isPermitted = useMemo(() => {
    if (!amount || !permitAllowance || !permitExpiration) return false
    return (permitAllowance.greaterThan(amount) || permitAllowance.equalTo(amount)) && permitExpiration >= now
  }, [amount, now, permitAllowance, permitExpiration])

  const shouldRequestApproval = !(isApproved || isApprovalLoading)
  // console.log('sig', shouldRequestSignature)
  // UniswapX trades do not need a permit signature step in between because the swap step _is_ the permit signature
  const shouldRequestSignature = !(isPermitted || isSigned)
  // console.log('sig', shouldRequestSignature, permitAllowance.greaterThan(amount))
  const approveAndPermit = useCallback(async () => {
      if (shouldRequestApproval) {
        await approveCallback()
      }
      if (shouldRequestSignature) await updatePermitAllowance()
    }, [shouldRequestApproval, updatePermitAllowance, approveCallback, shouldRequestSignature])

  return useMemo(() => {
    if (token) {
      if (!tokenAllowance || !permitAllowance) {
        return { state: AllowanceState.LOADING }
      } if (shouldRequestSignature) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading: false,
          isApprovalPending,
      //     isRevocationPending,
          approveAndPermit,
          approve: approveCallback,
          permit: updatePermitAllowance,
          revoke: revokeCallback,
          needsSetupApproval: !isApproved,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance,
        }
      } if (!isApproved) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading,
          isApprovalPending,
      //     isRevocationPending,
          approveAndPermit,
          approve: approveCallback,
          permit: updatePermitAllowance,
          revoke: revokeCallback,
          needsSetupApproval: true,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance,
        }
      }
    }
    return {
      token,
      state: AllowanceState.ALLOWED,
      permitSignature: !isPermitted && isSigned ? signature : undefined,
      needsSetupApproval: false,
      needsPermitSignature: false,
    }
  }, [
    approveCallback,
    approveAndPermit,
    isApprovalLoading,
    isApprovalPending,
    isApproved,
    isPermitted,
    isSigned,
    updatePermitAllowance,
    permitAllowance,
    revokeCallback,
//     isRevocationPending,
    shouldRequestSignature,
    signature,
    token,
    tokenAllowance,
  ])
}
