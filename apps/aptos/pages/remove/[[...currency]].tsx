import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, AutoColumn, Box, CardBody, RowBetween, Text } from '@pancakeswap/uikit'
import { Liquidity as LiquidityUI } from '@pancakeswap/widgets-internal'
import { LightGreyCard } from 'components/Card'
import { ExchangeLayout } from 'components/Layout/ExchangeLayout'
import { PageMeta } from 'components/Layout/Page'
import DetailToggler from 'components/Liquidity/components/DetailToggler'
import { MinimalPositionCard } from 'components/Liquidity/components/PositionCard'
import RemoveLiquidityButton from 'components/Liquidity/components/RemoveLiquidityButton'
import SimpleRemoveForm from 'components/Liquidity/components/SimpleRemoveForm'
import SlippageSection from 'components/Liquidity/components/SlippageSection'
import withLPValues from 'components/Liquidity/hocs/withLPValues'
import useBurnLiquidityInfo from 'components/Liquidity/hooks/useBurnLiquidityInfo'
import useCurrencySelectRoute from 'components/Liquidity/hooks/useCurrencySelectRoute'
import { usePair } from 'hooks/usePairs'
import { useMemo } from 'react'
import formatAmountDisplay from 'utils/formatAmountDisplay'
import { SettingsButton } from 'components/Menu/Settings/SettingsButton'

const { LiquidityCard } = LiquidityUI

const MinimalPositionCardContainer = withLPValues(MinimalPositionCard)

const RemoveLiquidityPage = () => {
  const { t } = useTranslation()

  const { currencyA, currencyB } = useCurrencySelectRoute()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  const [, pair] = usePair(currencyA, currencyB)

  const symbolA = currencyA?.symbol
  const symbolB = currencyB?.symbol

  const { formattedAmounts, parsedAmounts, error } = useBurnLiquidityInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    pair,
  )

  return (
    <>
      <PageMeta title={t('Remove Liquidity')} />
      <LiquidityCard>
        <LiquidityCard.Header
          backTo="/liquidity"
          title={t('Remove %assetA%-%assetB% Liquidity', {
            assetA: symbolA ?? '',
            assetB: symbolB ?? '',
          })}
          subtitle={t('To receive %assetA% and %assetB%', {
            assetA: symbolA ?? '',
            assetB: symbolB ?? '',
          })}
          config={<SettingsButton />}
        />
        <CardBody>
          <DetailToggler>
            {() => <SimpleRemoveForm currencyA={currencyA} currencyB={currencyB} formattedAmounts={formattedAmounts} />}
          </DetailToggler>
          <AutoColumn gap="8px" style={{ marginTop: '16px' }}>
            {pair && (
              <>
                <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
                  {t('Prices')}
                </Text>
                <LightGreyCard padding="24px" borderRadius="20px">
                  <AtomBox display="flex" justifyContent="space-between">
                    <Text small color="textSubtle">
                      1 {currencyA?.symbol} =
                    </Text>
                    <Text small>
                      {tokenA ? formatAmountDisplay(pair.priceOf(tokenA)) : '-'} {currencyB?.symbol}
                    </Text>
                  </AtomBox>
                  <AtomBox display="flex" justifyContent="space-between">
                    <Text small color="textSubtle">
                      1 {currencyB?.symbol} =
                    </Text>
                    <Text small>
                      {tokenB ? formatAmountDisplay(pair.priceOf(tokenB)) : '-'} {currencyA?.symbol}
                    </Text>
                  </AtomBox>
                </LightGreyCard>
              </>
            )}
            <SlippageSection />
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
          </AutoColumn>
          <Box position="relative" mt="16px">
            <RowBetween flexWrap="nowrap">
              <RemoveLiquidityButton
                currencyA={currencyA}
                currencyB={currencyB}
                tokenA={tokenA}
                tokenB={tokenB}
                error={error}
                parsedAmounts={parsedAmounts}
              />
            </RowBetween>
          </Box>
        </CardBody>
      </LiquidityCard>
      {pair ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCardContainer pair={pair} />
        </AutoColumn>
      ) : null}
    </>
  )
}

RemoveLiquidityPage.Layout = ExchangeLayout

export default RemoveLiquidityPage
