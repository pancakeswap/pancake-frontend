import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { usePotterytValutContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@web3-react/core'
import { fetchPotteryUserDataAsync } from 'state/pottery'

export const useDepositPottery = (amount: string) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = usePotterytValutContract()

  const handleDeposit = useCallback(async () => {
    const amountDeposit = new BigNumber(amount).multipliedBy(BIG_TEN.pow(18)).toString()
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(contract, 'deposit', [amountDeposit, account])
    })

    // TODO: Pottery ToastDescriptionWithTx text
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{t('Fake Text')}</ToastDescriptionWithTx>,
      )
      dispatch(fetchPotteryUserDataAsync(account))
    }
  }, [account, contract, amount, t, dispatch, callWithGasPrice, fetchWithCatchTxError, toastSuccess])

  return { isPending, handleDeposit }
}
