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
  isMobile: boolean
}

const NoChartAvailable: React.FC<NoChartAvailableProps> = ({
  isDark,
  isChartExpanded,
  token0Address,
  token1Address,
  pairAddress,
  isMobile,
}) => {
  const { t } = useTranslation()
  return (
    <StyledPriceChart $isDark={isDark} $isExpanded={isChartExpanded} p="24px">
      <Flex justifyContent="center" alignItems="center" height="100%" flexDirection="column">
        <Text mb={['8px', '8px', '0px']}>{t('Failed to load price chart for this pair')}</Text>
        <Text
          textAlign={isMobile ? 'center' : 'left'}
          mb={['8px', '8px', '0px']}
          color="textSubtle"
          small
          style={isMobile && { wordSpacing: '100vw' }}
        >
          Token0: {token0Address ?? 'null'}
        </Text>
        <Text
          textAlign={isMobile ? 'center' : 'left'}
          mb={['8px', '8px', '0px']}
          color="textSubtle"
          small
          style={isMobile && { wordSpacing: '100vw' }}
        >
          Token1: {token1Address ?? 'null'}
        </Text>
        <Text
          textAlign={isMobile ? 'center' : 'left'}
          mb={['8px', '8px', '0px']}
          color="textSubtle"
          small
          style={isMobile && { wordSpacing: '100vw' }}
        >
          Pair: {pairAddress ?? 'null'}
        </Text>
      </Flex>
    </StyledPriceChart>
  )
}

export default NoChartAvailable
