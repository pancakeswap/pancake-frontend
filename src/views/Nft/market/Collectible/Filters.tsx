import React from 'react'
import { Box, BoxProps, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { MinMaxFilter } from 'components/Filters'

const Filters: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation()

  const handleApply = (min: number, max: number) => {
    console.log(min, max)
  }

  return (
    <Box mb="32px" {...props}>
      <Text
        as="h4"
        fontSize="12px"
        color="textSubtle"
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing=".03em"
        mb="8px"
      >
        {t('Filter by')}
      </Text>
      <Flex alignItems="center">
        <MinMaxFilter title={t('Price')} min={1} max={100} onApply={handleApply} />
      </Flex>
    </Box>
  )
}

export default Filters
