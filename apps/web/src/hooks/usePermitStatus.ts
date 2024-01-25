import {
  AllowanceTransfer,
  Permit,
  Permit2ABI,
  generatePermitTypedData,
  getPermit2Address,
} from '@pancakeswap/permit2-sdk'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { ethereumTokens } from '@pancakeswap/tokens'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useCallback, useMemo } from 'react'
import { publicClient } from 'utils/client'
import { Address, isAddressEqual, zeroAddress } from 'viem'
import { useSignTypedData } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import useAccountActiveChain from './useAccountActiveChain'
import { useActiveChainId } from './useActiveChainId'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import useTokenAllowance from './useTokenAllowance'

type PermitStatus<T extends Token> = {
  // allowance to permit2 address
  allowance?: CurrencyAmount<T>
  // permit amount through permit2
  permitAmount?: CurrencyAmount<T>
  // permit expiration
  expiration: number
  nonce: number
}

// return current wallet's permit status
export const usePermitStatus = (token?: Token, owner?: Address, spender?: Address) => {
  const allowance = useTokenAllowanceToPermit2(token, owner)
  const permit = useTokenPermit(token, owner, spender)

  return useMemo<PermitStatus<Token>>(
    () => ({
      allowance,
      ...permit,
    }),
    [allowance, permit],
  )
}

const useTokenAllowanceToPermit2 = (token?: Currency, owner?: Address) => {
  const { chainId } = useActiveChainId()
  const { allowance } = useTokenAllowance(
    token?.isNative ? undefined : (token as Token),
    owner,
    getPermit2Address(chainId),
  )
  return allowance
}

const useTokenPermit = (token?: Token, owner?: Address, spender?: Address) => {
  const { chainId } = useActiveChainId()

  const inputs = useMemo<[Address, Address, Address]>(
    () => [owner ?? zeroAddress, token?.address ?? zeroAddress, spender ?? zeroAddress],
    [owner, spender, token?.address],
  )
  const defaultPermit = useMemo(() => {
    return {
      expiration: 0,
      permitAmount: token ? CurrencyAmount.fromRawAmount(token, '0') : undefined,
      nonce: 0,
    }
  }, [token])

  const { data: permit } = useQuery(
    ['/token-permit/', chainId, token?.address, owner, spender],
    () =>
      chainId && !token?.isNative
        ? publicClient({ chainId }).readContract({
            abi: Permit2ABI,
            address: getPermit2Address(chainId),
            functionName: 'allowance',
            args: inputs,
          })
        : undefined,
    {
      refetchInterval: SLOW_INTERVAL,
      retry: true,
      refetchOnWindowFocus: false,
      enabled: Boolean(token && spender && owner),
      select: (data) => {
        if (!data || token?.isNative) return undefined
        const [amount, expiration, nonce] = data
        return {
          permitAmount: CurrencyAmount.fromRawAmount(token!, amount),
          expiration: Number(expiration),
          nonce: Number(nonce),
        }
      },
    },
  )

  return permit ?? defaultPermit
}

export const useWritePermit = (token?: Token, spender?: Address, nonce?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { signTypedDataAsync } = useSignTypedData()

  return useCallback(async () => {
    if (!chainId) throw new Error('PERMIT: missing chainId')
    if (!token) throw new Error('PERMIT: missing token')
    if (!spender) throw new Error('PERMIT: missing spender')
    if (!account) throw new Error('PERMIT: missing owner')
    if (nonce === undefined) throw new Error('PERMIT: missing nonce')

    const permit: Permit = generatePermitTypedData(token, nonce, spender)
    const {
      domain,
      types,
      values: message,
    } = AllowanceTransfer.getPermitData(permit, getPermit2Address(chainId), chainId)

    const signature = await signTypedDataAsync({
      account,
      domain,
      primaryType: 'PermitSingle',
      types,
      message,
    })

    return {
      ...permit,
      signature,
    }
  }, [account, chainId, nonce, signTypedDataAsync, spender, token])
}

export enum PermitState {
  IDLE,
  REVOKING_ALLOWANCE,
  APPROVING_ALLOWANCE,
  APPROVING_PERMIT_AMOUNT,
  DONE,
}

export const useAllowanceRequirements = (
  approveByPermit2: boolean,
  amount: CurrencyAmount<Token> | undefined,
  spender?: Address,
) => {
  const { account } = useAccountActiveChain()
  const { allowance: tokenAllowance } = useTokenAllowance(amount?.currency, account, spender)
  const { allowance: permit2Allowance, permitAmount, expiration } = usePermitStatus(amount?.currency, account, spender)
  const now = useCurrentBlockTimestamp() ?? 0n

  const allowance = useMemo(
    () => (approveByPermit2 ? permit2Allowance : tokenAllowance),
    [approveByPermit2, permit2Allowance, tokenAllowance],
  )

  const requireRevoke = useMemo(() => {
    const isMainnetUSDT =
      amount?.currency?.chainId === ethereumTokens.usdt.chainId &&
      isAddressEqual(amount?.currency.address, ethereumTokens.usdt.address)

    if (!isMainnetUSDT) return false

    return allowance?.greaterThan(0) && allowance.lessThan(amount)
  }, [allowance, amount])

  const requireApprove = useMemo(() => {
    return amount && allowance?.lessThan(amount)
  }, [allowance, amount])

  const requirePermit = useMemo(() => {
    return (approveByPermit2 && amount && permitAmount?.lessThan(amount)) || (Boolean(expiration) && now >= expiration)
  }, [approveByPermit2, amount, permitAmount, expiration, now])

  return useMemo(() => {
    return {
      requireApprove,
      requireRevoke,
      requirePermit,
    }
  }, [requireApprove, requirePermit, requireRevoke])
}

export const usePermitOrApprove = (
  amount: CurrencyAmount<Currency> | undefined,
  // if use approve, spender is the target address to grant allowance through erc20 SC
  // if use permit2, spender is the target address to set permit amount through permit2 SC
  spender?: Address,
  onFinished?: () => Promise<SendTransactionResult | undefined>,
  // only used for permit2
  permit2signature?: Permit2Signature,
  // only used for permit2
  onUpdatePermit2Signature?: (signature: Permit2Signature) => void,
) => {
  const { account, chainId } = useAccountActiveChain()
  const tokenAmount = amount?.currency.isToken ? (amount as CurrencyAmount<Token>) : undefined

  const approveByPermit2 = useMemo(() => typeof onUpdatePermit2Signature === 'function', [onUpdatePermit2Signature])
  const { requireApprove, requireRevoke, requirePermit } = useAllowanceRequirements(
    approveByPermit2,
    tokenAmount,
    spender,
  )
  const requirePermit2 = useMemo(() => {
    return requirePermit && approveByPermit2
  }, [approveByPermit2, requirePermit])
  const permitState = useMemo((): PermitState => {
    if (requireRevoke || requireApprove) {
      return PermitState.IDLE
    }
    if (requirePermit2 && !permit2signature) {
      return PermitState.APPROVING_PERMIT_AMOUNT
    }
    return PermitState.DONE
  }, [requireRevoke, requireApprove, requirePermit2, permit2signature])
  const { nonce } = usePermitStatus(tokenAmount?.currency, account, spender)
  const permitCallback = useWritePermit(tokenAmount?.currency, spender, nonce)

  const approveTarget = useMemo(
    () => (approveByPermit2 ? getPermit2Address(chainId) : spender),
    [approveByPermit2, chainId, spender],
  )

  const { approveCallback, revokeCallback, approvalState } = useApproveCallback(amount, approveTarget)

  // execution of the permit state machine
  const execute = useCallback(async (): Promise<SendTransactionResult | undefined> => {
    console.debug('debug execute', {
      requireApprove,
      requireRevoke,
      requirePermit2,
      permitState: PermitState[permitState],
      approvalState: ApprovalState[approvalState],
    })
    // still pending confirming the approval, prevent trigger
    if (approvalState === ApprovalState.PENDING) return undefined

    // state case to match the permit flow
    switch (permitState) {
      // IDLE => APPROVING_ALLOWANCE
      // if require revoke, revoke first
      case PermitState.IDLE:
        if (requireRevoke) {
          return revokeCallback()
        }
        if (requireApprove) {
          return approveCallback()
        }
        break
      // REVOKING_ALLOWANCE => APPROVING_ALLOWANCE
      case PermitState.REVOKING_ALLOWANCE:
        if (approvalState === ApprovalState.NOT_APPROVED) {
          return approveCallback()
        }
        break
      // APPROVING_ALLOWANCE => APPROVING_PERMIT_AMOUNT
      case PermitState.APPROVING_ALLOWANCE:
      case PermitState.APPROVING_PERMIT_AMOUNT:
        if (approvalState === ApprovalState.APPROVED) {
          const sig = await permitCallback()
          onUpdatePermit2Signature?.(sig)
          return undefined
        }
        break
      case PermitState.DONE:
        if (onFinished) return onFinished()
        break
      default:
        break
    }

    return undefined
  }, [
    approvalState,
    approveCallback,
    onFinished,
    onUpdatePermit2Signature,
    permitCallback,
    permitState,
    requireApprove,
    requirePermit2,
    requireRevoke,
    revokeCallback,
  ])

  return useMemo(() => {
    return {
      execute,
      permitState,
      approvalState,
    }
  }, [approvalState, execute, permitState])
}
