import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { UNWRAPPED_ETH_ADDRESS } from 'config/constants/liquidStaking'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useContract } from 'hooks/useContract'
import { useCallback, useMemo, useState } from 'react'
import { calculateGasMargin } from 'utils'
import { getViemClients } from 'utils/viem'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { useSendTransaction } from 'wagmi'

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

export const useCallClaimContract = (claimedAmount?: CurrencyAmount<Currency>, indexes?: number[]) => {
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm
  const { sendTransactionAsync } = useSendTransaction()

  const { account, chainId } = useAccountActiveChain()

  const calldata = '0x'

  const onClaim = useCallback(async () => {
    if (!account || !claimedAmount) return

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
      .then(() => {
        setAttemptingTxn(false)
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [account, chainId, claimedAmount, sendTransactionAsync])

  return useMemo(
    () => ({
      onClaim,
      attemptingTxn,
    }),
    [attemptingTxn, onClaim],
  )
}
