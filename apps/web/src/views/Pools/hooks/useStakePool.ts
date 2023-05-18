import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gas: DEFAULT_GAS_LIMIT,
}

const sousStake = async (sousChefContract, amount, gasPrice: bigint, decimals = 18) => {
  return sousChefContract.write.deposit([new BigNumber(amount).times(getFullDecimalMultiplier(decimals)).toString()], {
    ...options,
    gasPrice,
  })
}

const sousStakeBnb = async (sousChefContract, amount, gasPrice: bigint) => {
  return sousChefContract.write.deposit([new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()], {
    ...options,
    gasPrice,
  })
}

const useStakePool = (sousId: number, isUsingBnb = false) => {
  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingBnb) {
        return sousStakeBnb(sousChefContract, amount, gasPrice)
      }
      return sousStake(sousChefContract, amount, gasPrice, decimals)
    },
    [isUsingBnb, sousChefContract, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakePool
