import { useTranslation } from '@pancakeswap/localization'
import { Liquidity as LiquidityUI, Swap as SwapUI } from '@pancakeswap/uikit'

const { LiquidityCard } = LiquidityUI
const { Page } = SwapUI

const RemoveLiquidityPage = () => {
  const { t } = useTranslation()

  const symbolA = ''
  const symbolB = ''

  return (
    <Page helpUrl="https://docs.pancakeswap.finance/products/pancakeswap-exchange" isEvm={false}>
      <LiquidityCard>
        <LiquidityCard.Header
          backTo="/liquidity"
          title={t('Remove %assetA%-%assetB% liquidity', {
            assetA: symbolA ?? '',
            assetB: symbolB ?? '',
          })}
          subtitle={t('To receive %assetA% and %assetB%', {
            assetA: symbolA ?? '',
            assetB: symbolB ?? '',
          })}
        />
        {/* <RowBetween>
              <Text>{t('Amount')}</Text>
              <Button variant="text" scale="sm" onClick={() => setShowDetailed(!showDetailed)}>
                {showDetailed ? t('Simple') : t('Detailed')}
              </Button>
            </RowBetween> */}
        {/* {showDetailed ? <DetailRemoveForm/> : <SimpleRemoveForm />} */}
        {/* {pair && (
          <AutoColumn gap="10px" style={{ marginTop: '16px' }}>
            <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
              {t('Prices')}
            </Text>
            <LightGreyCard>
              <Flex justifyContent="space-between">
                <Text small color="textSubtle">
                  1 {currencyA?.symbol} =
                </Text>
                <Text small>
                  {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text small color="textSubtle">
                  1 {currencyB?.symbol} =
                </Text>
                <Text small>
                  {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                </Text>
              </Flex>
            </LightGreyCard>
          </AutoColumn>
        )} */}
        {/* <RowBetween mt="16px">
            <Text bold color="secondary" fontSize="12px">
              {t('Slippage Tolerance')}
            </Text>
            <Text bold color="primary">
              {allowedSlippage / 100}%
            </Text>
          </RowBetween> */}
        {/* {poolData && (
            <RowBetween mt="16px">
              <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
                {t('LP reward APR')}
              </TooltipText>
              {tooltipVisible && tooltip}
              <Text bold color="primary">
                {formatAmount(poolData.lpApr7d)}%
              </Text>
            </RowBetween>
          )} */}
      </LiquidityCard>
    </Page>
  )
}

export default RemoveLiquidityPage
