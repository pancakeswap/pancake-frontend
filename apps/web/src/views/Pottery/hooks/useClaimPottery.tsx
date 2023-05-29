import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { usePotterytDrawContract } from 'hooks/useContract'
import { fetchPotteryUserDataAsync } from 'state/pottery'
import { useWeb3React } from '@pancakeswap/wagmi'

export const useClaimPottery = () => {
  const { t } = useTranslation()
  const { account, chain } = useWeb3React()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const contract = usePotterytDrawContract()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleClaim = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() =>
      contract.write.claimReward({
        account,
        chain,
      }),
    )

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed your rewards.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchPotteryUserDataAsync(account))
    }
  }, [fetchWithCatchTxError, contract.write, account, chain, toastSuccess, t, dispatch])

  return { isPending, handleClaim }
}
