import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { StyledPriceChart } from './styles'

interface NoChartAvailableProps {
  isDark: boolean
  isChartExpanded: boolean
  token0Address: string
  token1Address: string
  pairAddress: string
}

const NoChartAvailable: React.FC<NoChartAvailableProps> = ({
  isDark,
  isChartExpanded,
  token0Address,
  token1Address,
  pairAddress,
}) => {
  const { t } = useTranslation()
  return (
    <StyledPriceChart $isDark={isDark} $isExpanded={isChartExpanded} p="24px">
      <Flex justifyContent="center" alignItems="center" height="100%" flexDirection="column">
        <Text>{t('No price chart is available for this pair')}</Text>
        <Text color="textSubtle" small>
          Token0: {token0Address ?? 'null'}
        </Text>
        <Text color="textSubtle" small>
          Token1: {token1Address ?? 'null'}
        </Text>
        <Text color="textSubtle" small>
          Pair: {pairAddress ?? 'null'}
        </Text>
      </Flex>
    </StyledPriceChart>
  )
}

export default NoChartAvailable
