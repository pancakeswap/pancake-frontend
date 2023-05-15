import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { usePotterytVaultContract } from 'hooks/useContract'
import { Address } from 'wagmi'
import { fetchPotteryUserDataAsync } from 'state/pottery'
import { useWeb3React } from '@pancakeswap/wagmi'

export const useWithdrawPottery = (redeemShare: string, vaultAddress: Address) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account, chain } = useWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = usePotterytVaultContract(vaultAddress)

  const handleWithdraw = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() =>
      contract.write.redeem([BigInt(redeemShare), account, account], {
        account,
        chain,
      }),
    )

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchPotteryUserDataAsync(account))
    }
  }, [fetchWithCatchTxError, contract.write, redeemShare, account, chain, toastSuccess, t, dispatch])

  return { isPending, handleWithdraw }
}
