import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallback } from 'react'
import { getQuestRewardAddress } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers'
import { Address } from 'viem'

interface EnableButtonProps {
  disabled: boolean
  currency: Currency
  setLastUpdated: () => void
}

export const EnableButton: React.FC<React.PropsWithChildren<EnableButtonProps>> = ({
  disabled,
  currency,
  setLastUpdated,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const onApprove = useCallback(async () => {
    if (!currency.isNative) {
      const spender = getQuestRewardAddress(currency.chainId)
      const contract = getBep20Contract(currency?.address as Address)

      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(contract, 'approve', [spender as Address, MaxUint256])
      })

      if (receipt?.status) {
        toastSuccess(
          t('Success Enabled!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{t('You can now deposit')}</ToastDescriptionWithTx>,
        )
        setLastUpdated()
      }
    }
  }, [currency, setLastUpdated, fetchWithCatchTxError, callWithGasPrice, toastSuccess, t])

  return (
    <Button
      mt="24px"
      width="100%"
      disabled={disabled || isPending}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={onApprove}
    >
      {t('Enable')}
    </Button>
  )
}
