import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { usePotterytValutContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { fetchPotteryUserDataAsync } from 'state/pottery'

export const useWithdrawPottery = (amount: string) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = usePotterytValutContract()

  const handleWithdraw = useCallback(async () => {
    const redeemShare = await contract.convertToAssets(amount)
    const receipt = await fetchWithCatchTxError(() => contract.redeem(redeemShare, account, account))

    // TODO: Pottery ToastDescriptionWithTx text
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{t('Fake Text')}</ToastDescriptionWithTx>,
      )
      dispatch(fetchPotteryUserDataAsync(account))
    }
  }, [account, contract, amount, t, dispatch, fetchWithCatchTxError, toastSuccess])

  return { isPending, handleWithdraw }
}
