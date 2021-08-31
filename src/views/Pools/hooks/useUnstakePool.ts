import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { parseUnits } from 'ethers/lib/utils'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'

const sousUnstake = async (sousChefContract: any, amount: string, decimals: number) => {
  const gasPrice = getGasPrice()
  const units = parseUnits(amount, decimals)

  const tx = await sousChefContract.withdraw(units.toString(), {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

const sousEmergencyUnstake = async (sousChefContract: any) => {
  const gasPrice = getGasPrice()
  const tx = await sousChefContract.emergencyWithdraw({ gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await unstakeFarm(masterChefContract, 0, amount)
      } else if (enableEmergencyWithdraw) {
        await sousEmergencyUnstake(sousChefContract)
      } else {
        await sousUnstake(sousChefContract, amount, decimals)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
