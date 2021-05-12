import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useSousChefV2 } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId: number, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId.toString(), account))
      dispatch(updateUserBalance(sousId.toString(), account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export const usePoolStakingLimit = (sousId: number) => {
  const [poolLimit, setPoolLimit] = useState(0)
  const sousChefV2Contract = useSousChefV2(sousId)

  useEffect(() => {
    const fetchPoolLimit = async () => {
      try {
        const limit = await sousChefV2Contract.methods.poolLimitPerUser().call()
        setPoolLimit(parseInt(limit, 10))
      } catch (error) {
        // V1 pools do not contain "poolLimitPerUser" and is not supported
        setPoolLimit(0)
      }
    }

    fetchPoolLimit()
  }, [setPoolLimit, sousChefV2Contract])

  return poolLimit
}

export default useStake
