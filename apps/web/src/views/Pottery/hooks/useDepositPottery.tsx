import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { usePotterytVaultContract } from 'hooks/useContract'
import { Address } from 'wagmi'
import { fetchPotteryUserDataAsync } from 'state/pottery'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useWeb3React } from '@pancakeswap/wagmi'

export const useDepositPottery = (amount: string, potteryVaultAddress: Address) => {
  const { t } = useTranslation()
  const { account, chain } = useWeb3React()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const contract = usePotterytVaultContract(potteryVaultAddress)

  const handleDeposit = useCallback(async () => {
    const amountDeposit = new BigNumber(amount).multipliedBy(DEFAULT_TOKEN_DECIMAL).toString()
    const receipt = await fetchWithCatchTxError(() =>
      contract.write.deposit([BigInt(amountDeposit), account], {
        account,
        chain,
      }),
    )

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchPotteryUserDataAsync(account))
    }
  }, [amount, fetchWithCatchTxError, contract.write, account, chain, toastSuccess, t, dispatch])

  return { isPending, handleDeposit }
}
