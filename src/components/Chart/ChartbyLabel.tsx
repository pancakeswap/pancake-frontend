import { Flex, FlexProps, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

export const ChartByLabel = ({
  symbol,
  link,
  by,
  ...props
}: { symbol: string; link: string; by: string } & FlexProps) => {
  const { t } = useTranslation()
  return (
    <Flex alignItems="center" px="24px" {...props}>
      <Text fontSize="14px" mr="4px">
        {symbol} {t('Chart')} {t('by')}
      </Text>
      <Link fontSize="14px" href={link} external>
        {by}
      </Link>
    </Flex>
  )
}
