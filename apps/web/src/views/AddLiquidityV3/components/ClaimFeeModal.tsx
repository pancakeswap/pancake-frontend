import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Button, Flex, InjectedModalProps, Modal } from '@pancakeswap/uikit'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

interface ClaimFeeModal {
  collect: () => void
  feeValueUpper: CurrencyAmount<Currency>
  feeValueLower: CurrencyAmount<Currency>
}

export default function ClaimFeeModal({
  onDismiss,
  collect,
  feeValueUpper,
  feeValueLower,
}: InjectedModalProps & ClaimFeeModal) {
  const {
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <Modal title="Claim fee" onDismiss={onDismiss}>
      <Flex>
        <div>{feeValueUpper?.currency?.symbol}</div>
        <div>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4, locale) : '-'}</div>
      </Flex>
      <Flex>
        <div>{feeValueLower?.currency?.symbol}</div>
        <div>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4, locale) : '-'}</div>
      </Flex>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="320px">
        <Button onClick={collect}>Claim</Button>
      </Flex>
    </Modal>
  )
}
