import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { IconButton, Loading, useToast, useTooltip, WalletRegisterIcon } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from './Toast'

export function CoinRegisterButton({ currency }: { currency: Currency }) {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Register coin to receive transfers'), {
    placement: 'auto',
    trigger: 'hover',
  })

  const { sendTransactionAsync, isLoading } = useSendTransaction()
  const { fetchWithCatchTxError, loading } = useCatchTxError()
  const { toastSuccess } = useToast()

  return (
    <>
      <div ref={targetRef}>
        <IconButton
          variant="text"
          onClick={() => {
            fetchWithCatchTxError(() =>
              sendTransactionAsync({
                payload: {
                  type: 'entry_function_payload',
                  type_arguments: [currency.address],
                  arguments: [],
                  function: `0x1::managed_coin::register`,
                },
              }),
            ).then(
              (rec) =>
                rec?.status && toastSuccess(t('Registered!'), <ToastDescriptionWithTx txHash={rec.transactionHash} />),
            )
          }}
          style={{ width: 'auto' }}
          scale="sm"
        >
          {!isLoading && !loading ? <WalletRegisterIcon color="textSubtle" /> : <Loading width="16px" height="16px" />}
        </IconButton>
      </div>
      {tooltipVisible && tooltip}
    </>
  )
}
