import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { useSousChef } from 'hooks/useContract'

const options = {}

const sousStake = async (sousChefContract, amount, decimals = 18) => {
  return sousChefContract.write.deposit([new BigNumber(amount).times(getFullDecimalMultiplier(decimals)).toString()], {
    ...options,
  })
}

const sousStakeBnb = async (sousChefContract, amount) => {
  return sousChefContract.write.deposit([new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()], {
    ...options,
  })
}

const useStakePool = (sousId: number, isUsingBnb = false) => {
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingBnb) {
        return sousStakeBnb(sousChefContract, amount)
      }
      return sousStake(sousChefContract, amount, decimals)
    },
    [isUsingBnb, sousChefContract],
  )

  return { onStake: handleStake }
}

export default useStakePool
