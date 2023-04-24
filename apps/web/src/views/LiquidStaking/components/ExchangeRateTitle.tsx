import { Text, QuestionHelper, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export function ExchangeRateTitle({ isETH }) {
  const { t } = useTranslation()

  const tooltipMsg = isETH
    ? `wBETH's exchange rate is determined by the value accrued vs ETH. As you receive rewards, your amount of wBETH will not change.`
    : `sBNB's exchange rate is determined by the value accrued vs BNB. As you receive rewards, your amount of sBNB will not change.`

  return (
    <Flex>
      <Text color="textSubtle">{t('Exchange Rate')}</Text>
      <QuestionHelper ml="4px" text={tooltipMsg} size="20px" />
    </Flex>
  )
}
