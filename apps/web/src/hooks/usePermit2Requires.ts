import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { ethereumTokens } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import { Address, isAddressEqual } from 'viem'
import useAccountActiveChain from './useAccountActiveChain'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import { usePermit2Allowance } from './usePermit2Allowance'
import { usePermit2Details } from './usePermit2Details'

export const usePermit2Requires = (amount: CurrencyAmount<Token> | undefined, spender?: Address) => {
  const { account } = useAccountActiveChain()
  const allowance = usePermit2Allowance(account, amount?.currency)
  const { amount: permitAmount, expiration } = usePermit2Details(account, amount?.currency, spender)
  const now = useCurrentBlockTimestamp() ?? 0n

  const requireRevoke = useMemo((): boolean => {
    const isMainnetUSDT =
      amount?.currency?.chainId === ethereumTokens.usdt.chainId &&
      isAddressEqual(amount?.currency.address, ethereumTokens.usdt.address)

    if (!isMainnetUSDT) return false

    return !!allowance && allowance.greaterThan(0) && allowance.lessThan(amount)
  }, [allowance, amount])

  const requireApprove = useMemo((): boolean => {
    return !!amount && !!allowance && allowance.lessThan(amount)
  }, [allowance, amount])

  const requirePermit = useMemo((): boolean => {
    return (amount && permitAmount?.lessThan(amount)) || (Boolean(expiration) && now >= expiration)
  }, [amount, permitAmount, expiration, now])

  return {
    requireApprove,
    requireRevoke,
    requirePermit,
  }
}
