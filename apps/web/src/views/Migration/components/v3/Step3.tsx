import { useTheme } from '@pancakeswap/hooks'
import { AtomBox, AutoColumn, AutoRow, Heading, LinkExternal, Text } from '@pancakeswap/uikit'
import { Chart } from '@pancakeswap/widgets-internal'
import { format } from 'd3'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/chains'
import { bscTokens, ethereumTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { LightCard } from 'components/Card'
import { Bound } from 'config/constants/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { PoolState } from 'hooks/v3/types'
import { tryParsePrice, tryParseTick } from 'hooks/v3/utils'
import { getTickToPrice } from 'hooks/v3/utils/getTickToPrice'
import { useCallback, useMemo, useState } from 'react'
import { batch } from 'react-redux'
import HideShowSelectorSection from 'views/AddLiquidityV3/components/HideShowSelectorSection'
import { FeeOption } from 'views/AddLiquidityV3/formViews/V3FormView/components/FeeOption'
import { FeeTierPercentageBadge } from 'views/AddLiquidityV3/formViews/V3FormView/components/FeeTierPercentageBadge'
import RangeSelector from 'views/AddLiquidityV3/formViews/V3FormView/components/RangeSelector'
import { FEE_AMOUNT_DETAIL, SelectContainer } from 'views/AddLiquidityV3/formViews/V3FormView/components/shared'
import { useRangeHopCallbacks } from 'views/AddLiquidityV3/formViews/V3FormView/form/hooks/useRangeHopCallbacks'
import { useV3MintActionHandlers } from 'views/AddLiquidityV3/formViews/V3FormView/form/hooks/useV3MintActionHandlers'
import { useV3FormState } from 'views/AddLiquidityV3/formViews/V3FormView/form/reducer'
import mockData from './mock.json'

const MOCK = {
  ticksAtLimit: {
    LOWER: false,
    UPPER: false,
  },
  formattedData: mockData,
  price: 1,
}

const ZOOM = {
  initialMin: 0.5,
  initialMax: 1.5,
  min: 0.5,
  max: 1.5,
}

const feeAmount = FeeAmount.MEDIUM

const MOCK_TOKENS = {
  [ChainId.BSC]: [bscTokens.cake, bscTokens.wbnb],
  [ChainId.ETHEREUM]: [ethereumTokens.wbtc, ethereumTokens.weth],
}

const distributions = {
  [FeeAmount.LOWEST]: 10,
  [FeeAmount.LOW]: 20,
  [FeeAmount.MEDIUM]: 40,
  [FeeAmount.HIGH]: 30,
}

const poolsByFeeTier = {
  [FeeAmount.LOWEST]: PoolState.EXISTS,
  [FeeAmount.LOW]: PoolState.EXISTS,
  [FeeAmount.MEDIUM]: PoolState.EXISTS,
  [FeeAmount.HIGH]: PoolState.EXISTS,
}

export function Step3() {
  const { theme } = useTheme()
  const { chainId } = useActiveChainId()

  const [token0, token1] = chainId && MOCK_TOKENS[chainId] ? MOCK_TOKENS[chainId] : MOCK_TOKENS[ChainId.BSC]

  const formState = useV3FormState()

  const brushLabelValue = useCallback((d: 'w' | 'e', x: number) => {
    const { price, ticksAtLimit } = MOCK
    if (!price) return ''

    if (d === 'w' && ticksAtLimit[Bound.LOWER]) return '0'
    if (d === 'e' && ticksAtLimit[Bound.UPPER]) return '∞'

    const percent = (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100

    return price ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%` : ''
  }, [])

  const { ticksAtLimit } = MOCK

  const isSorted = token0.sortsBefore(token1)

  const leftRangeTypedValue = formState.leftRangeTypedValue || tryParsePrice(token0, token1, '0.75')
  const rightRangeTypedValue = formState.rightRangeTypedValue || tryParsePrice(token0, token1, '1.25')

  const ticks: {
    [key: string]: number | undefined
  } = useMemo(() => {
    return {
      [Bound.LOWER]: tryParseTick(feeAmount, leftRangeTypedValue),
      [Bound.UPPER]: tryParseTick(feeAmount, rightRangeTypedValue),
    }
  }, [leftRangeTypedValue, rightRangeTypedValue])

  const pricesAtTicks = useMemo(() => {
    return {
      [Bound.LOWER]: getTickToPrice(token0, token1, ticks[Bound.LOWER]),
      [Bound.UPPER]: getTickToPrice(token0, token1, ticks[Bound.UPPER]),
    }
  }, [ticks, token0, token1])

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = priceLower
    const rightPrice = priceUpper

    return leftPrice && rightPrice
      ? [parseFloat(leftPrice?.toSignificant(6)), parseFloat(rightPrice?.toSignificant(6))]
      : undefined
  }, [priceLower, priceUpper])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onLeftRangeInput, onRightRangeInput } = useV3MintActionHandlers(false, false)

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0])
      const rightRangeValue = Number(domain[1])

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6
      }

      batch(() => {
        // simulate user input for auto-formatting and other validations
        if (
          (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] || mode === 'handle' || mode === 'reset') &&
          leftRangeValue > 0
        ) {
          onLeftRangeInput(tryParsePrice(token0, token1, leftRangeValue.toString()))
        }

        if ((!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === 'reset') && rightRangeValue > 0) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(tryParsePrice(token0, token1, rightRangeValue.toString()))
          }
        }
      })
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit, token0, token1],
  )

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper } = useRangeHopCallbacks(
    token0 ?? undefined,
    token1 ?? undefined,
    feeAmount,
    tickLower,
    tickUpper,
  )
  const { t } = useTranslation()

  const [feeAmount_, setFeeAmount] = useState(FeeAmount.MEDIUM)
  const [showOptions, setShowOptions] = useState(true)

  return (
    <AtomBox textAlign="center">
      <Heading scale="lg" pb="16px">
        {t('Quick Start')} - {t('PancakeSwap V3')}
      </Heading>
      <Text pb="48px">
        {t(
          'In PancakeSwap Exchange V3, liquidity providers are able to customize the trading fee tier and concentrate their liquidity to a specific price range to maximize their capital efficiency.',
        )}
      </Text>

      <AutoRow
        gap="32px"
        flexWrap={{
          xs: 'wrap',
          md: 'nowrap',
        }}
        alignItems="flex-start"
      >
        <LightCard minWidth={['100%', null, null, '50%']}>
          <AutoRow gap="24px" justifyContent="center" py="12px">
            <Heading scale="lg" color="secondary">
              {t('Customize Trading Fee Tiers')}
            </Heading>
            <AtomBox px="24px" width="100%" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
              <HideShowSelectorSection
                showOptions={showOptions}
                noHideButton={!feeAmount_}
                setShowOptions={setShowOptions}
                heading={
                  <AutoColumn gap="8px">
                    <Text>
                      {FEE_AMOUNT_DETAIL[feeAmount].label}% {t('fee tier')}
                    </Text>
                    {distributions && (
                      <FeeTierPercentageBadge
                        distributions={distributions}
                        feeAmount={feeAmount}
                        poolState={poolsByFeeTier[feeAmount]}
                      />
                    )}
                  </AutoColumn>
                }
                content={
                  <>
                    <SelectContainer>
                      {[FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((_feeAmount) => {
                        return (
                          <FeeOption
                            largestUsageFeeTier={feeAmount}
                            feeAmount={_feeAmount}
                            active={feeAmount_ === _feeAmount}
                            onClick={() => setFeeAmount(_feeAmount)}
                            distributions={distributions}
                            poolState={poolsByFeeTier[_feeAmount]}
                            key={_feeAmount}
                          />
                        )
                      })}
                    </SelectContainer>
                  </>
                }
              />
            </AtomBox>
            <Heading scale="md" bold color="textSubtle">
              {t('Choose the fee rate you want when providing liquidity')}
            </Heading>
            <Text color="textSubtle">
              {t(
                'You can choose a trading fee rate from 1%, 0.25%, 0.05%, and 0.01% when providing liquidity. Usually, lower fee rates are more popular among stable assets, while more volatile assets will benefit from a higher fee rate.',
              )}
            </Text>
            <Text color="textSubtle">
              {t(
                'Please note that the UI automatically chooses the most popular trading fee tier after selecting the trading pair.',
              )}
            </Text>
          </AutoRow>
        </LightCard>
        <LightCard minWidth={['100%', null, null, '50%']} p="32px">
          <AutoRow gap="24px" justifyContent="center" py="12px">
            <Heading scale="lg" color="secondary">
              {t('Concentrate Your Liquidity')}
            </Heading>
            <AutoRow gap="12px" width="100%" paddingX="24px">
              <AtomBox position="relative" width="100%">
                <Chart
                  showZoomButtons={false}
                  data={{ current: MOCK.price, series: MOCK.formattedData as any[] }}
                  dimensions={{ width: 400, height: 200 }}
                  margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
                  styles={{
                    area: {
                      selection: theme.colors.text,
                    },
                    brush: {
                      handle: {
                        west: theme.colors.failure,
                        east: theme.colors.secondary,
                      },
                    },
                  }}
                  interactive
                  brushLabels={brushLabelValue}
                  brushDomain={brushDomain}
                  onBrushDomainChange={onBrushDomainChangeEnded}
                  zoomLevels={ZOOM}
                  ticksAtLimit={MOCK.ticksAtLimit}
                />
              </AtomBox>
              <RangeSelector
                priceLower={priceLower}
                priceUpper={priceUpper}
                getDecrementLower={getDecrementLower}
                getIncrementLower={getIncrementLower}
                getDecrementUpper={getDecrementUpper}
                getIncrementUpper={getIncrementUpper}
                onLeftRangeInput={onLeftRangeInput}
                onRightRangeInput={onRightRangeInput}
                currencyA={token0}
                currencyB={token1}
                feeAmount={feeAmount}
                ticksAtLimit={ticksAtLimit}
              />
            </AutoRow>
            <Heading scale="md" bold color="textSubtle">
              {t('Provide liquidity to a specific price range')}
            </Heading>
            <Text color="textSubtle">
              {t(
                'You can concentrate your liquidity within a price range. This offers traders deeper liquidity and allows you to earn more from trading fees with less capital investment.',
              )}
            </Text>
            <Text color="textSubtle">
              {t('Your liquidity is only active and earning fees when the current price stays within the price range.')}
            </Text>
            <Text color="textSubtle">
              {t(
                'Please note that after selecting the trading pair and fee tier, the UI automatically selects the appropriate price range for you.',
              )}
            </Text>
          </AutoRow>
        </LightCard>
      </AutoRow>
      <AtomBox p="48px">
        <LinkExternal m="auto" href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/liquidity-guide">
          {t('Learn More')}
        </LinkExternal>
      </AtomBox>
    </AtomBox>
  )
}
