import { ExpandIcon, Flex, IconButton, ShrinkIcon, SyncAltIcon, Text } from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'

const PriceChart = ({
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
  isMobile,
  isFullWidthContainer,
  token0Address,
  token1Address,
  currentSwapPrice,
}) => {
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)

  return (
    <StyledPriceChart
      height="70%"
      overflow="unset"
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      $isFullWidthContainer={isFullWidthContainer}
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
        </Flex>
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
            </IconButton>
          </Flex>
        )}
      </Flex>
      <BasicChart
        token0Address={token0Address}
        token1Address={token1Address}
        isChartExpanded={isChartExpanded}
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        isMobile={isMobile}
        currentSwapPrice={currentSwapPrice}
      />
    </StyledPriceChart>
  )
}

export default PriceChart
