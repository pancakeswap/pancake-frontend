import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useApproveCallback } from 'hooks/useApproveCallback'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useMemo } from 'react'
import { getVeCakeContract } from 'utils/contractHelpers'
import { useAccount, useWalletClient } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { useBSCCakeToken } from './useBSCCakeToken'

export const useLockAllowance = () => {
  const { data: walletClient } = useWalletClient()
  const { chainId } = useActiveChainId()
  const cakeToken = useBSCCakeToken()
  const veCakeContract = getVeCakeContract(walletClient ?? undefined, chainId)
  const { address: account } = useAccount()

  return useTokenAllowance(cakeToken, account, veCakeContract.address)
}

export const useShouldGrantAllowance = (targetAmount: bigint) => {
  const { allowance } = useLockAllowance()
  return allowance && allowance.greaterThan(targetAmount)
}

export const useLockApproveCallback = (amount: string) => {
  const { data: walletClient } = useWalletClient()
  const { chainId } = useActiveChainId()
  const cakeToken = useBSCCakeToken()
  const veCakeContract = getVeCakeContract(walletClient ?? undefined, chainId)
  const rawAmount = useMemo(
    () => getDecimalAmount(new BN(amount || 0), cakeToken?.decimals),
    [amount, cakeToken?.decimals],
  )

  const currencyAmount = useMemo(
    () => (cakeToken ? CurrencyAmount.fromRawAmount<Currency>(cakeToken, rawAmount.toString()) : undefined),
    [cakeToken, rawAmount],
  )

  const { approvalState, approveCallback, currentAllowance } = useApproveCallback(
    currencyAmount,
    veCakeContract.address,
  )

  return { approvalState, approveCallback, currentAllowance }
}
