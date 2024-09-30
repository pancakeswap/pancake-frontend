import { useTranslation } from '@pancakeswap/localization'
import { Currency, ERC20Token } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useContract } from 'hooks/useContract'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { LiquidStakingList } from '../constants/types'

interface RequestWithdrawButtonProps {
  inputCurrency: Currency | ERC20Token
  currentAmount: BigNumber
  selectedList: LiquidStakingList
}

export function useRequestWithdraw({ inputCurrency, currentAmount, selectedList }: RequestWithdrawButtonProps) {
  const { fetchWithCatchTxError, loading } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { address: account } = useAccount()

  const { t } = useTranslation()
  const router = useRouter()

  const convertedWithdrawalAmount =
    currentAmount && inputCurrency ? getDecimalAmount(currentAmount, inputCurrency.decimals) : BIG_ZERO

  const contract = useContract(selectedList?.contract, selectedList?.abi)

  const requestWithdraw = useCallback(async () => {
    if (!convertedWithdrawalAmount || !account) return

    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(contract, selectedList?.requestWithdrawFn, [convertedWithdrawalAmount.toString()])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Withdrawal Request Submitted!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {`${t('Your withdrawal request might take 7 days.')}`}
        </ToastDescriptionWithTx>,
      )

      router.push('/liquid-staking')
    }
  }, [
    account,
    callWithGasPrice,
    contract,
    convertedWithdrawalAmount,
    fetchWithCatchTxError,
    router,
    selectedList?.requestWithdrawFn,
    t,
    toastSuccess,
  ])

  return useMemo(
    () => ({
      loading,
      requestWithdraw,
    }),
    [loading, requestWithdraw],
  )
}
