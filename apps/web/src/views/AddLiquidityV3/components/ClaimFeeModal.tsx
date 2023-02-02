import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { AutoRow, Button, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { CurrencyLogo } from 'components/Logo'
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
    <Modal title="Collect fees" onDismiss={onDismiss}>
      <LightGreyCard mb="16px">
        <AutoRow justifyContent="space-between">
          <Flex>
            <CurrencyLogo currency={feeValueUpper?.currency} size="24px" />
            <Text color="primary" ml="4px">
              {feeValueUpper?.currency?.symbol}
            </Text>
          </Flex>
          <Text>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4, locale) : '-'}</Text>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Flex>
            <CurrencyLogo currency={feeValueLower?.currency} size="24px" />
            <Text color="primary" ml="4px">
              {feeValueLower?.currency?.symbol}
            </Text>
          </Flex>
          <Text>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4, locale) : '-'}</Text>
        </AutoRow>
      </LightGreyCard>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="320px">
        <Button width="100%" onClick={collect}>
          Collect
        </Button>
      </Flex>
    </Modal>
  )
}
