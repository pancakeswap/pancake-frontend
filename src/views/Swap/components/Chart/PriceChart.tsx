import {
  Button,
  ExpandIcon,
  Flex,
  IconButton,
  ShrinkIcon,
  SyncAltIcon,
  Text,
  TradingViewIcon,
  LineGraphIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { TradingViewLabel } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import React, { useCallback, useState } from 'react'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager } from 'state/user/hooks'
import styled from 'styled-components'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'
import TradingViewChart from './TradingViewChart'
import TokenDisplay from './TokenDisplay'

const ChartButton = styled(Button)`
  background-color: ${({ $active, theme }) => $active && `${theme.colors.primary}0f`};
  padding: 4px 8px;
  border-radius: 6px;
`

const PriceChart = ({
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
  isMobile,
  token0Address,
  token1Address,
  currentSwapPrice,
}) => {
  const { isDesktop } = useMatchBreakpoints()
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  const [chartView, setChartView] = useExchangeChartViewManager()
  const [twChartSymbol, setTwChartSymbol] = useState('')
  const { t } = useTranslation()

  const handleTwChartSymbol = useCallback((symbol) => {
    setTwChartSymbol(symbol)
  }, [])

  return (
    <StyledPriceChart
      height={chartView === ChartViewMode.TRADING_VIEW ? '100%' : '70%'}
      overflow={chartView === ChartViewMode.TRADING_VIEW ? 'hidden' : 'unset'}
      $isDark={isDark}
      $isExpanded={isChartExpanded}
    >
      <Flex justifyContent="space-between" px="24px">
        <Flex alignItems="center">
          {outputCurrency ? (
            <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
          ) : (
            inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
          )}
          {inputCurrency && (
            <Text color="text" bold>
              {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
            </Text>
          )}
          <IconButton variant="text" onClick={onSwitchTokens}>
            <SyncAltIcon ml="6px" color="primary" />
          </IconButton>
          <Flex>
            <ChartButton
              aria-label={t('Basic')}
              title={t('Basic')}
              $active={chartView === ChartViewMode.BASIC}
              scale="sm"
              variant="text"
              color="primary"
              onClick={() => setChartView(ChartViewMode.BASIC)}
              mr="8px"
            >
              {isDesktop ? t('Basic') : <LineGraphIcon color="primary" />}
            </ChartButton>
            <ChartButton
              aria-label="TradingView"
              title="TradingView"
              $active={chartView === ChartViewMode.TRADING_VIEW}
              scale="sm"
              variant="text"
              onClick={() => setChartView(ChartViewMode.TRADING_VIEW)}
            >
              {isDesktop ? 'TradingView' : <TradingViewIcon color="primary" />}
            </ChartButton>
          </Flex>
        </Flex>
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
            </IconButton>
          </Flex>
        )}
      </Flex>
      {chartView === ChartViewMode.BASIC && (
        <BasicChart
          token0Address={token0Address}
          token1Address={token1Address}
          isChartExpanded={isChartExpanded}
          inputCurrency={inputCurrency}
          outputCurrency={outputCurrency}
          isMobile={isMobile}
          currentSwapPrice={currentSwapPrice}
        />
      )}
      {chartView === ChartViewMode.TRADING_VIEW && (
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height={isMobile ? '100%' : isChartExpanded ? 'calc(100% - 48px)' : '458px'}
          pt="12px"
        >
          <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
            <TokenDisplay
              value={currentSwapPrice?.[token0Address]}
              inputSymbol={inputCurrency?.symbol}
              outputSymbol={outputCurrency?.symbol}
              mx="24px"
            />
            {twChartSymbol && <TradingViewLabel symbol={twChartSymbol} />}
          </Flex>
          <TradingViewChart
            // unmount the whole component when symbols is changed
            key={`${inputCurrency?.symbol}-${outputCurrency?.symbol}`}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
            isDark={isDark}
            onTwChartSymbol={handleTwChartSymbol}
          />
        </Flex>
      )}
    </StyledPriceChart>
  )
}

export default PriceChart
