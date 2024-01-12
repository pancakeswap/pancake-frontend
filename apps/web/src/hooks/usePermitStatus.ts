import {
  AllowanceTransfer,
  Permit,
  Permit2ABI,
  generatePermitTypedData,
  getPermit2Address,
} from '@pancakeswap/permit2-sdk'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { ethereumTokens } from '@pancakeswap/tokens'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const allowance = useTokenAllowanceToPermit(token, owner)
  const permit = useTokenPermit(token, owner, spender)

  return useMemo<PermitStatus<Token>>(
    () => ({
      allowance,
      ...permit,
    }),
    [allowance, permit],
  )
}

const useTokenAllowanceToPermit = (token?: Token, owner?: Address) => {
  const { chainId } = useActiveChainId()
  const { allowance } = useTokenAllowance(token, owner, getPermit2Address(chainId))
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
      chainId
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
        if (!data) return undefined
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

enum PermitState {
  IDLE,
  REVOKING_ALLOWANCE,
  APPROVING_ALLOWANCE,
  APPROVING_PERMIT_AMOUNT,
  DONE,
}

export const usePermitRequirements = (amount: CurrencyAmount<Token> | undefined, spender?: Address) => {
  const { account } = useAccountActiveChain()
  const { allowance, permitAmount, expiration } = usePermitStatus(amount?.currency, account, spender)
  const now = useCurrentBlockTimestamp() ?? 0n

  const requireRevoke = useMemo(() => {
    const isMainnetUSDT =
      amount?.currency.chainId === ethereumTokens.usdt.chainId &&
      isAddressEqual(amount?.currency.address, ethereumTokens.usdt.address)

    if (!isMainnetUSDT) return false

    return allowance?.greaterThan(0) && allowance.lessThan(amount)
  }, [allowance, amount])

  const requireApprove = useMemo(() => {
    return amount && allowance?.lessThan(amount)
  }, [allowance, amount])

  const requirePermit = useMemo(() => {
    return (amount && permitAmount?.lessThan(amount)) || now >= expiration
  }, [permitAmount, amount, now, expiration])

  return useMemo(
    () => ({
      requireRevoke,
      requireApprove,
      requirePermit,
    }),
    [requireApprove, requirePermit, requireRevoke],
  )
}

export const usePermit = <T extends Token>(
  amount: CurrencyAmount<T> | undefined,
  spender?: Address,
  onPermitDone?: () => unknown,
) => {
  const { account, chainId } = useAccountActiveChain()

  const [permitState, setPermitState] = useState<PermitState>(PermitState.IDLE)
  const [permit2Signature, setPermit2Signature] = useState<Permit2Signature>()

  const { requireApprove, requireRevoke, requirePermit } = usePermitRequirements(amount, spender)
  const { nonce } = usePermitStatus(amount?.currency, account, spender)
  const permitCallback = useWritePermit(amount?.currency, spender, nonce)

  const { approveCallback, revokeCallback, approvalState } = useApproveCallback(amount, getPermit2Address(chainId))

  // execution of the permit state machine
  const execute = useCallback(async (): Promise<SendTransactionResult | undefined> => {
    console.debug('debug execute permitState', PermitState[permitState])
    // still pending confirming the approval, prevent trigger
    if (approvalState === ApprovalState.PENDING) return undefined

    // state case to match the permit flow
    switch (permitState) {
      // IDLE => APPROVING_ALLOWANCE
      // if require revoke, revoke first
      case PermitState.IDLE:
        if (requireRevoke) {
          // setPermitState(PermitState.REVOKING_ALLOWANCE)
          return revokeCallback()
        }
        if (requireApprove) {
          // setPermitState(PermitState.APPROVING_ALLOWANCE)
          return approveCallback()
        }
        break
      // REVOKING_ALLOWANCE => APPROVING_ALLOWANCE
      case PermitState.REVOKING_ALLOWANCE:
        if (approvalState === ApprovalState.NOT_APPROVED) {
          // setPermitState(PermitState.APPROVING_ALLOWANCE)
          return approveCallback()
        }
        break
      // APPROVING_ALLOWANCE => APPROVING_PERMIT_AMOUNT
      case PermitState.APPROVING_ALLOWANCE:
      case PermitState.APPROVING_PERMIT_AMOUNT:
        if (approvalState === ApprovalState.APPROVED) {
          // setPermitState(PermitState.APPROVING_PERMIT_AMOUNT)
          const sig = await permitCallback()
          setPermit2Signature(sig)
          return undefined
        }
        break
      case PermitState.DONE:
        // todo allowance and permit are enough, call swap
        if (onPermitDone) onPermitDone()
        break
      default:
        break
    }

    return undefined
  }, [
    approvalState,
    approveCallback,
    onPermitDone,
    permitCallback,
    permitState,
    requireApprove,
    requireRevoke,
    revokeCallback,
  ])

  // permit state machine, the only place to change the state
  useEffect(() => {
    if (requireRevoke || requireApprove) {
      setPermitState(PermitState.IDLE)
    } else if (requirePermit) {
      setPermitState(PermitState.APPROVING_PERMIT_AMOUNT)
    } else {
      setPermitState(PermitState.DONE)
    }
  }, [requireRevoke, requireApprove, requirePermit])

  return useMemo(() => {
    return {
      execute,
      permit2Signature,
      permitState,
    }
  }, [execute, permit2Signature, permitState])
}
