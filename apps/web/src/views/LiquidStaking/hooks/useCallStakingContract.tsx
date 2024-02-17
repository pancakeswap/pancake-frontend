import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

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
