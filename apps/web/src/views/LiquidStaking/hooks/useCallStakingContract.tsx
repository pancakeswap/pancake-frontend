import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { Multicall, toHex } from '@pancakeswap/v3-sdk'
import { unwrappedEth } from 'config/abi/unwrappedEth'
import { UNWRAPPED_ETH_ADDRESS } from 'config/constants/liquidStaking'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { getViemClients } from 'utils/viem'
import { encodeFunctionData } from 'viem'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

export const useCallStakingContract = (selectedList: LiquidStakingList | null) => {
  const contract = useContract(selectedList?.contract, selectedList?.abi)
  const { callWithGasPrice } = useCallWithGasPrice()

  return useCallback(
    (methodArgsValues: { [methodArgName: string]: any }, overridesValues: { [overrideArgName: string]: any }) => {
      if (!selectedList) {
        throw new Error('No selected list')
      }
      const methodArgs = selectedList.stakingMethodArgs
        .map((methodArg) => {
          return methodArgsValues[methodArg]
        })
        .filter(Boolean)

      const overrides = selectedList.stakingOverrides.reduce((acc, override) => {
        const overrideValue = overridesValues[override]
        if (!isUndefinedOrNull(overrideValue)) {
          return { ...acc, [override]: overridesValues[override] }
        }
        return acc
      }, {})

      return callWithGasPrice(contract, 'deposit', methodArgs, overrides)
    },
    [callWithGasPrice, contract, selectedList],
  )
}

export const useCallClaimContract = (claimedAmount?: CurrencyAmount<Currency>, indexNumber?: number) => {
  const { data, sendTransactionAsync, status } = useSendTransaction()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: data,
  })
  const { account, chainId } = useAccountActiveChain()
  const addTransaction = useTransactionAdder()

  const calldata = useMemo(() => {
    return indexNumber !== undefined
      ? Multicall.encodeMulticall(
          encodeFunctionData({
            abi: unwrappedEth,
            functionName: 'claimWithdraw',
            args: [toHex(indexNumber)],
          }),
        )
      : ''
  }, [indexNumber])

  const onClaim = useCallback(async () => {
    if (!account || !claimedAmount || !calldata) return

    getViemClients({ chainId })
      ?.estimateGas({
        account,
        to: UNWRAPPED_ETH_ADDRESS,
        data: calldata,
      })
      .then((gasLimit) => {
        return sendTransactionAsync({
          account,
          to: UNWRAPPED_ETH_ADDRESS,
          data: calldata,
          gas: calculateGasMargin(gasLimit),
          chainId,
        })
      })
      .then((hash) => {
        addTransaction(
          { hash },
          {
            type: 'claim-liquid-staking',
            summary: `Claim ${claimedAmount?.toSignificant(6)} ${claimedAmount?.currency?.symbol}`,
          },
        )
      })
  }, [account, addTransaction, calldata, chainId, claimedAmount, sendTransactionAsync])

  return useMemo(
    () => ({
      onClaim,
      isLoading: isConfirming || status === 'pending',
    }),
    [isConfirming, onClaim, status],
  )
}
