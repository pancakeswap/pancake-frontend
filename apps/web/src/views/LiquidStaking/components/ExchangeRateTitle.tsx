import { Text, QuestionHelper, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export function ExchangeRateTitle() {
  const { t } = useTranslation()

  const tooltipMsg = t(
    `WBETH's exchange rate is determined by the value accrued vs ETH. As you receive rewards, your amount of WBETH will not change.`,
  )

  return (
    <Flex>
      <Text color="textSubtle">{t('Exchange Rate')}</Text>
      <QuestionHelper ml="4px" text={tooltipMsg} size="20px" placement="bottom" />
    </Flex>
  )
}
