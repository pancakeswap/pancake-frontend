import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCallback } from 'react'

export const useCallStakingContract = (selectedList: LiquidStakingList) => {
  const contract = useContract(selectedList?.contract, selectedList?.abi)
  const { callWithGasPrice } = useCallWithGasPrice()

  return useCallback(
    (methodArgsValues: { [methodArgName: string]: any }, overridesValues: { [overrideArgName: string]: any }) => {
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
