import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { bscTestnetTokens, bscTokens } from '@pancakeswap/tokens'
import { QueryObserverResult } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useApproveCallback } from 'hooks/useApproveCallback'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useMemo, useState } from 'react'
import { Address, isAddressEqual } from 'viem'
import { SendTransactionResult } from 'wagmi/actions'

type UseApproveReturnType = {
  allowance: CurrencyAmount<Token> | undefined

  requireApprove: boolean
  requireRevoke: boolean

  isApproving: boolean
  isRevoking: boolean

  approve: () => Promise<SendTransactionResult | undefined>
  revoke: () => Promise<SendTransactionResult | undefined>
  refetch: () => Promise<QueryObserverResult<bigint>>
}

export const useApproveRequires = (amount: CurrencyAmount<Token> | undefined, spender?: Address) => {
  const { account } = useAccountActiveChain()
  const { allowance, refetch } = useTokenAllowance(amount?.currency, account, spender)

  const requireRevoke = useMemo((): boolean => {
    const isMainnetUSDT =
      amount?.currency?.chainId === bscTokens.usdt.chainId &&
      isAddressEqual(amount?.currency.address, bscTokens.usdt.address)

    const isBSCTestNetBUSD =
      amount?.currency?.chainId === bscTestnetTokens.busd.chainId &&
      isAddressEqual(amount?.currency.address, bscTestnetTokens.busd.address)

    if (!isMainnetUSDT || isBSCTestNetBUSD) return false

    return !!allowance && allowance.greaterThan(0) && allowance.lessThan(amount)
  }, [allowance, amount])

  const requireApprove = useMemo((): boolean => {
    return !!amount && !!allowance && allowance.lessThan(amount)
  }, [allowance, amount])

  return {
    requireApprove,
    requireRevoke,
    allowance,
    refetch,
  }
}

export const useApprove = (
  amount: CurrencyAmount<Token> | undefined,
  spender: Address | undefined,
): UseApproveReturnType => {
  const { requireApprove, requireRevoke, allowance, refetch } = useApproveRequires(amount, spender)
  const { revokeCallback, approveCallback } = useApproveCallback(amount, spender)

  const [isRevoking, setIsRevoking] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const approve = async () => {
    setIsApproving(true)
    try {
      const result = await approveCallback()
      setIsApproving(false)
      return result
    } catch (error) {
      setIsApproving(false)
      throw error
    }
  }

  const revoke = async () => {
    setIsRevoking(true)
    try {
      const result = await revokeCallback()
      setIsRevoking(false)
      return result
    } catch (error) {
      setIsRevoking(false)
      throw error
    }
  }

  return {
    allowance,

    requireApprove,
    requireRevoke,

    isApproving,
    isRevoking,

    refetch,
    approve,
    revoke,
  }
}
