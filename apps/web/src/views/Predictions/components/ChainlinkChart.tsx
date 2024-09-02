import { useTranslation } from '@pancakeswap/localization'
import {
  Flex,
  FlexGap,
  FlexProps,
  Text,
  additionalColors,
  baseColors,
  darkColors,
  lightColors,
} from '@pancakeswap/uikit'
import { formatBigIntToFixed } from '@pancakeswap/utils/formatBalance'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { LineChartLoader } from 'components/ChartLoaders'
import PairPriceDisplay from 'components/PairPriceDisplay'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import dayjs from 'dayjs'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useChainlinkOracleContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { IChartApi, SeriesMarkerPosition, SeriesMarkerShape, UTCTimestamp, createChart } from 'lightweight-charts'
import orderBy from 'lodash/orderBy'
import { darken } from 'polished'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGetRoundsByCloseOracleId, useGetSortedRounds } from 'state/predictions/hooks'
import { NodeRound } from 'state/types'
import { styled } from 'styled-components'
import { useReadContract, useReadContracts } from '@pancakeswap/wagmi'
import { useConfig } from '../context/ConfigProvider'
import { CHART_DOT_CLICK_EVENT } from '../helpers'
import usePollOraclePrice from '../hooks/usePollOraclePrice'
import useSwiper from '../hooks/useSwiper'

function useChainlinkLatestRound() {
  const config = useConfig()
  const { chainId } = useActiveChainId()

  const chainlinkOracleContract = useChainlinkOracleContract(config?.chainlinkOracleAddress)
  const { data } = useReadContract({
    abi: chainlinkOracleABI,
    address: chainlinkOracleContract.address,
    functionName: 'latestRound',
    query: {
      enabled: !!chainlinkOracleContract,
    },
    chainId,
    watch: true,
  })

  return data
}

function useChainlinkRoundDataSet() {
  const { chainId } = useActiveChainId()
  const lastRound = useChainlinkLatestRound()
  const config = useConfig()
  const chainlinkOracleAddress = config?.chainlinkOracleAddress

  const { data, error } = useReadContracts({
    ...(lastRound &&
      chainlinkOracleAddress && {
        contracts: Array.from({ length: 50 }).map(
          (_, i) =>
            ({
              chainId,
              abi: chainlinkOracleABI,
              address: chainlinkOracleAddress,
              functionName: 'getRoundData',
              args: [(lastRound ?? 0n) - BigInt(i)] as const,
            } as const),
        ),
      }),
    query: {
      enabled: !!lastRound,
      placeholderData: keepPreviousData,
    },
  })

  const computedData: ChartData[] = useMemo(() => {
    return (
      data
        ?.filter((d) => !!d && d.status === 'success' && d.result[1] > 0n)
        ?.map(({ result }) => {
          // roundId = 0, answer = 1, startedAt = 2
          return {
            answer: formatBigIntToFixed(result?.[1] ?? 0n, 4, 8),
            roundId: result?.[0]?.toString() ?? '0',
            startedAt: Number(result?.[2]),
          }
        }) ?? []
    )
  }, [data])

  return { data: computedData, error }
}

type ChartData = {
  answer: string
  roundId: string
  startedAt: number
}

function useChartHover() {
  const { data } = useQuery<ChartData>({
    queryKey: ['chainlinkChartHover'],
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return data
}

function useChartHoverMutate() {
  const queryClient = useQueryClient()

  const updateHover = useCallback(
    (data) => {
      if (data) {
        queryClient.setQueryData(['chainlinkChartHover'], data)
      } else {
        queryClient.resetQueries({ queryKey: ['chainlinkChartHover'] })
      }
    },
    [queryClient],
  )

  return updateHover
}

const ChainlinkChartWrapper = styled(Flex)<{ isMobile?: boolean }>`
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ theme, isMobile }) => (isMobile ? theme.card.background : theme.colors.gradientBubblegum)};
`

const HoverData = ({ rounds }: { rounds: { [key: string]: NodeRound } }) => {
  const hoverData = useChartHover()
  const config = useConfig()
  const { price: answerAsBigNumber } = usePollOraclePrice({ chainlinkOracleAddress: config?.chainlinkOracleAddress })
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <PairPriceDisplay
      width="100%"
      value={hoverData ? hoverData.answer : formatBigIntToFixed(answerAsBigNumber, 4, 8)}
      inputSymbol={config?.token?.symbol}
      outputSymbol="USD"
      format={false}
      flexWrap="wrap"
      alignItems="center"
      columnGap="12px"
      zIndex={2}
    >
      {hoverData && (
        <FlexGap minWidth="51%" alignItems="center" gap="12px" height="22px">
          <Text color="textSubtle" lineHeight={1.1}>
            {new Date(hoverData.startedAt * 1000).toLocaleString(locale, {
              year: 'numeric',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {rounds[hoverData.roundId] && (
            <Text fontSize="20px" color="secondary" bold lineHeight={1.1}>
              {t('Round')}: #{rounds[hoverData.roundId].epoch}
            </Text>
          )}
        </FlexGap>
      )}
    </PairPriceDisplay>
  )
}

const ChainLinkChart = (props: FlexProps & { isMobile?: boolean }) => {
  const { data } = useChainlinkRoundDataSet()
  const rounds = useGetRoundsByCloseOracleId()

  if (!data.length) {
    return <LineChartLoader />
  }

  return (
    <ChainlinkChartWrapper {...props}>
      <FlexGap
        flexDirection="row"
        pt="12px"
        px="20px"
        alignItems="center"
        flexWrap="wrap"
        columnGap="12px"
        height={['56px', '0', '0', '0', '44px']}
      >
        {rounds && <HoverData rounds={rounds} />}
      </FlexGap>
      <Flex height={[`calc(100% - 56px)`]}>{rounds && <Chart rounds={rounds} data={data} />}</Flex>
    </ChainlinkChartWrapper>
  )
}

/**
 * Note: remember that it needs to be mounted inside the container with fixed height
 */
const Chart = ({
  rounds,
  data,
}: {
  rounds: {
    [key: string]: NodeRound
  }
  data: ChartData[]
}) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const { isDark } = useTheme()
  const mutate = useChartHoverMutate()
  const transformedData = useMemo(() => {
    return orderBy(
      data?.map(({ startedAt, answer }) => {
        return { time: startedAt as UTCTimestamp, value: parseFloat(answer) }
      }) || [],
      'time',
      'asc',
    )
  }, [data])
  const sortedRounds = useGetSortedRounds()
  const { swiper } = useSwiper()

  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

  useEffect(() => {
    if (!chartRef?.current) return

    const chart = createChart(chartRef?.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? darkColors.secondary : lightColors.secondary,
      },
      autoSize: true,
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        scaleMargins: {
          top: 0.001,
          bottom: 0.001,
        },
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        secondsVisible: false,
        fixRightEdge: true,
        fixLeftEdge: true,
        tickMarkFormatter: (unixTime: number) => {
          return dayjs.unix(unixTime).format('h:mm a')
        },
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          labelVisible: true,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: isDark ? darkColors.textSubtle : lightColors.textSubtle,
        },
      },
    })

    const newSeries = chart.addAreaSeries({
      lineWidth: 2,
      lineColor: baseColors.primary,
      topColor: darken(0.01, baseColors.primary),
      bottomColor: isDark ? darkColors.backgroundDisabled : lightColors.backgroundDisabled,
      priceFormat: {
        type: 'price',
        precision: 4,
        minMove: 0.0001,
      },
    })
    setChart(chart)

    const markers = orderBy(
      data
        .filter((chartData) => chartData.roundId in rounds)
        .map((chartData) => ({
          time: chartData.startedAt as UTCTimestamp,
          roundId: chartData.roundId,
          position: 'inBar' as SeriesMarkerPosition,
          color: isDark ? additionalColors.gold : additionalColors.overlay,
          shape: 'circle' as SeriesMarkerShape,
          size: 0.5,
        })),
      'time',
      'asc',
    )

    newSeries.setData(transformedData)
    newSeries.setMarkers(markers)

    const crossHairHandler = (param) => {
      if (newSeries && param) {
        const timestamp = param.time as number
        if (!timestamp) return
        const hoveredRound = data.find((round) => round.startedAt === timestamp)
        mutate(hoveredRound)
      } else {
        mutate(undefined)
      }
    }
    chart.subscribeCrosshairMove(crossHairHandler)

    const clickHandler = (param) => {
      if (swiper && param?.seriesData) {
        const seriesMarkers = param?.seriesData?.keys?.()?.next?.()?.value?.markers?.()
        const clickedMarker = seriesMarkers?.find((marker) => marker.time === param.time)
        const roundIndex =
          (clickedMarker &&
            sortedRounds?.findIndex((round) =>
              'roundId' in clickedMarker ? round.closeOracleId === clickedMarker.roundId : false,
            )) ??
          -1
        if (roundIndex >= 0) {
          swiper.slideTo(roundIndex)
          swiper.el.dispatchEvent(new Event(CHART_DOT_CLICK_EVENT))
        }
      }
    }
    chart.subscribeClick(clickHandler)

    // eslint-disable-next-line consistent-return
    return () => {
      chart.unsubscribeClick(clickHandler)
      chart.unsubscribeCrosshairMove(crossHairHandler)
      chart.remove()
    }
  }, [transformedData, isDark, locale, mutate, data, rounds, swiper, sortedRounds])

  const handleMouseLeave = useCallback(() => {
    mutate(undefined)
  }, [mutate])

  return (
    <>
      {!chartCreated && <LineChartLoader />}
      <div style={{ display: 'flex', flex: 1, height: '100%' }} onMouseLeave={handleMouseLeave}>
        <div style={{ flex: 1, maxWidth: '100%' }} ref={chartRef} id="chartlink-line-chart" />
      </div>
    </>
  )
}

export default ChainLinkChart
