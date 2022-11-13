import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { IconButton, Loading, useTooltip, WalletRegisterIcon } from '@pancakeswap/uikit'

export function CoinRegisterButton({ currency }: { currency: Currency }) {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Register coin to receive transfers'), {
    placement: 'auto',
    trigger: 'hover',
  })

  const { sendTransactionAsync, isLoading } = useSendTransaction()

  return (
    <>
      <IconButton
        variant="text"
        onClick={() => {
          sendTransactionAsync({
            payload: {
              type: 'entry_function_payload',
              type_arguments: [currency.address],
              arguments: [],
              function: `0x1::managed_coin::register`,
            },
          })
        }}
        scale="sm"
        ref={targetRef}
      >
        {!isLoading ? <WalletRegisterIcon color="primary" /> : <Loading />}
      </IconButton>
      {tooltipVisible && tooltip}
    </>
  )
}
