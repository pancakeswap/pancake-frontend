import { Flex, FlexProps, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import React from 'react'

export const ChartByLabel = ({
  symbol,
  link,
  by,
  ...props
}: { symbol: string; link: string; by: string } & FlexProps) => {
  const { t } = useTranslation()
  return (
    <Flex alignItems="center" px="24px" {...props}>
      <Link fontSize="14px" href={link} external>
        {symbol} {t('Chart')}
      </Link>
      <Text fontSize="14px" ml="4px">
        {t('by')} {by}
      </Text>
    </Flex>
  )
}
