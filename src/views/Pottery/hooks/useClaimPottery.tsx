import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { usePotterytDrawContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { fetchPotteryUserDataAsync } from 'state/pottery'

export const useClaimPottery = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const contract = usePotterytDrawContract()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleClaim = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => contract.connect(account).claimReward())

    // TODO: Pottery ToastDescriptionWithTx text
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{t('Fake Text')}</ToastDescriptionWithTx>,
      )
      dispatch(fetchPotteryUserDataAsync(account))
    }
  }, [account, contract, t, dispatch, fetchWithCatchTxError, toastSuccess])

  return { isPending, handleClaim }
}
