import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useV2SSBCakeWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { fetchBCakeWrapperUserDataAsync } from 'state/farms'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCakeStakeFarm } from 'utils/calls'
import { Address } from 'viem'

import useCatchTxError from 'hooks/useCatchTxError'

export const useUpdateBCakeFarms = (bCakeWrapperAddress: Address, pid: number) => {
  const { gasPrice } = useFeeDataWithGasPrice()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { toastSuccess } = useToast()
  const V2SSBCakeContract = useV2SSBCakeWrapperContract(bCakeWrapperAddress)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  const onDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchBCakeWrapperUserDataAsync({ account, pids: [pid], chainId }))
    }
  }, [account, chainId, dispatch, pid])
  const handleStake = useCallback(async () => {
    const noHarvest = true
    const Tx = await bCakeStakeFarm(V2SSBCakeContract, '0', gasPrice, BOOSTED_FARM_V3_GAS_LIMIT, noHarvest)
    return Tx
  }, [V2SSBCakeContract, gasPrice])

  const updateBCakeMultiplier = async () => {
    const receipt = await fetchWithCatchTxError(() => handleStake())
    if (receipt?.status) {
      toastSuccess(
        `${t('Updated')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your bCake booster have been updated')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  return { onUpdate: updateBCakeMultiplier }
}
