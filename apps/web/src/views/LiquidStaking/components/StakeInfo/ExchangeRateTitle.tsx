import { useTranslation } from '@pancakeswap/localization'
import { Flex, QuestionHelper, Text } from '@pancakeswap/uikit'

interface ExchangeRateTitleProps {
  tokenOSymbol?: string
  token1Symbol?: string
}

export const ExchangeRateTitle: React.FC<ExchangeRateTitleProps> = ({ tokenOSymbol, token1Symbol }) => {
  const { t } = useTranslation()

  const tooltipMsg = t(
    `%token1%'s exchange rate is determined by the value accrued vs %token0%. As you receive rewards, your amount of %token1% will not change.`,
    {
      token0: tokenOSymbol ?? '',
      token1: token1Symbol ?? '',
    },
  )

  return (
    <Flex>
      <Text color="textSubtle">{t('Exchange Rate')}</Text>
      <QuestionHelper ml="4px" text={tooltipMsg} size="20px" placement="bottom" />
    </Flex>
  )
}
