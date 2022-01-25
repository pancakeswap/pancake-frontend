import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { parseUnits } from '@ethersproject/units'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/actions'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'

const sousUnstake = (sousChefContract: any, amount: string, decimals: number) => {
  const gasPrice = getGasPrice()
  const units = parseUnits(amount, decimals)

  return sousChefContract.withdraw(units.toString(), {
    gasPrice,
  })
}

const sousEmergencyUnstake = (sousChefContract: any) => {
  const gasPrice = getGasPrice()
  return sousChefContract.emergencyWithdraw({ gasPrice })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (
      amount: string,
      decimals: number,
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      let tx
      if (sousId === 0) {
        tx = await unstakeFarm(masterChefContract, 0, amount)
      } else if (enableEmergencyWithdraw) {
        tx = await sousEmergencyUnstake(sousChefContract)
      } else {
        tx = await sousUnstake(sousChefContract, amount, decimals)
      }
      onTransactionSubmitted(tx)
      const receipt = await tx.wait()
      if (receipt.status) {
        onSuccess(receipt)
        dispatch(updateUserStakedBalance(sousId, account))
        dispatch(updateUserBalance(sousId, account))
        dispatch(updateUserPendingReward(sousId, account))
      } else {
        onError(receipt)
      }
    },
    [account, dispatch, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
