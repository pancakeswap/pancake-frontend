import { useTheme } from '@pancakeswap/hooks'
import { AtomBox } from '@pancakeswap/ui'
import { AutoRow, Heading, Text } from '@pancakeswap/uikit'
import { format } from 'd3'
// import { saturate } from 'polished'
import { ChainId } from '@pancakeswap/sdk'
import { bscTokens, ethereumTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { LightCard } from 'components/Card'
import { Chart } from 'components/LiquidityChartRangeInput/Chart'
import { Bound } from 'config/constants/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { tryParseTick } from 'hooks/v3/utils'
import { getTickToPrice } from 'hooks/v3/utils/getTickToPrice'
import { useV3FormState } from 'views/AddLiquidityV3/formViews/V3FormView/form/reducer'
import Image from 'next/image'
import { useCallback, useMemo } from 'react'
import { batch } from 'react-redux'
import RangeSelector from 'views/AddLiquidityV3/formViews/V3FormView/components/RangeSelector'
import { useRangeHopCallbacks } from 'views/AddLiquidityV3/formViews/V3FormView/form/hooks/useRangeHopCallbacks'
import { useV3MintActionHandlers } from 'views/AddLiquidityV3/formViews/V3FormView/form/hooks/useV3MintActionHandlers'
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

export function Step3() {
  // const { t } = useTranslation()
  const { theme } = useTheme()
  const { chainId } = useActiveChainId()

  const [token0, token1] = MOCK_TOKENS[chainId] || MOCK_TOKENS[ChainId.BSC]

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

  const leftRangeTypedValue = formState.leftRangeTypedValue || '0.75'
  const rightRangeTypedValue = formState.rightRangeTypedValue || '1.25'

  const ticks: {
    [key: string]: number | undefined
  } = useMemo(() => {
    return {
      [Bound.LOWER]: tryParseTick(token0, token1, feeAmount, leftRangeTypedValue.toString()),
      [Bound.UPPER]: tryParseTick(token0, token1, feeAmount, rightRangeTypedValue.toString()),
    }
  }, [leftRangeTypedValue, rightRangeTypedValue, token0, token1])

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
  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(false, false)

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
          onLeftRangeInput(leftRangeValue.toFixed(6))
        }

        if ((!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === 'reset') && rightRangeValue > 0) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(rightRangeValue.toFixed(6))
          }
        }
      })
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
  )

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper } = useRangeHopCallbacks(
    token0 ?? undefined,
    token1 ?? undefined,
    feeAmount,
    tickLower,
    tickUpper,
  )

  return (
    <AtomBox textAlign="center">
      <Heading scale="lg" pb="16px">
        V3 Quick Start
      </Heading>
      <Text pb="48px">
        (Overview of v3)Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </Text>

      <AutoRow
        gap="32px"
        flexWrap={{
          xs: 'wrap',
          md: 'nowrap',
        }}
        alignItems="flex-start"
      >
        <LightCard minWidth={['100%', null, null, '50%']} p="32px">
          <Heading scale="lg" color="secondary" mb="32px">
            Introducing Fee tiers
          </Heading>
          <Image src="/images/decorations/farm-plant-coin.png" width={86} height={124} alt="farm and fee" />
          <Text bold color="textSecondary" my="24px">
            How it works?
          </Text>
          <Text mt="8px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          </Text>
        </LightCard>
        <LightCard minWidth={['100%', null, null, '50%']} p="32px">
          <Heading scale="lg" color="secondary" pb="24px">
            Introducing Price Range
          </Heading>
          <AutoRow gap="12px" width="100%">
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
          <Text bold color="textSecondary">
            How it works on the LP?
          </Text>
          <Text mt="8px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          </Text>
        </LightCard>
      </AutoRow>
    </AtomBox>
  )
}
