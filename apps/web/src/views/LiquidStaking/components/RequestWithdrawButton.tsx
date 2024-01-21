import { useTranslation } from '@pancakeswap/localization'
import { Currency, ERC20Token } from '@pancakeswap/sdk'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useContract } from 'hooks/useContract'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { LiquidStakingList } from '../constants/types'

interface RequestWithdrawButtonProps {
  inputCurrency: Currency | ERC20Token
  currentAmount: BigNumber
  selectedList: LiquidStakingList
}

function useRequestWithdraw({ inputCurrency, currentAmount, selectedList }: RequestWithdrawButtonProps) {
  const { fetchWithCatchTxError, loading } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { account } = useAccountActiveChain()

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
          {`${t('You will receive your')} ${selectedList?.token0.symbol} ${t('soon.')}`}
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
    selectedList?.token0.symbol,
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

export function RequestWithdrawButton({ inputCurrency, currentAmount, selectedList }: RequestWithdrawButtonProps) {
  const { t } = useTranslation()

  const { loading, requestWithdraw } = useRequestWithdraw({
    inputCurrency,
    currentAmount,
    selectedList,
  })

  return (
    <Button
      width="100%"
      endIcon={loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
      isLoading={loading}
      disabled={currentAmount.eq(0)}
      onClick={requestWithdraw}
    >
      {loading ? `${t('Requesting')}` : t('Request')}
    </Button>
  )
}
