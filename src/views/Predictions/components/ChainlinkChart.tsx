import { useCallback, useEffect, useMemo } from 'react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, Dot } from 'recharts'
import useTheme from 'hooks/useTheme'
import { LineChartLoader } from 'views/Info/components/ChartLoaders'
import { useTranslation } from 'contexts/Localization'
import { laggyMiddleware, useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import useSWRImmutable from 'swr/immutable'
import { useSWRConfig } from 'swr'
import { useChainlinkOracleContract } from 'hooks/useContract'
import { getChainlinkOracleAddress } from 'utils/addressHelpers'
import { ChainlinkOracle } from 'config/abi/types'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import { FlexGap } from 'components/Layout/Flex'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { useGetRoundsByCloseOracleId, useGetSortedRounds } from 'state/predictions/hooks'
import styled from 'styled-components'
import { Flex, Text, FlexProps } from '@pancakeswap/uikit'
import PairPriceDisplay from 'components/PairPriceDisplay'
import { NodeRound } from 'state/types'
import useSwiper from '../hooks/useSwiper'

const chainlinkAddress = getChainlinkOracleAddress()
function useChainlinkRoundDataSet() {
  const chainlinkOracleContract = useChainlinkOracleContract(false)
  const lastRound = useSWRContract([chainlinkOracleContract, 'latestRound'], {
    use: [laggyMiddleware],
  })

  const calls = useMemo(() => {
    return lastRound.data
      ? Array.from({ length: 50 }).map((_, i) => ({
          address: chainlinkAddress,
          name: 'getRoundData',
          params: [lastRound.data.sub(i)],
        }))
      : null
  }, [lastRound.data])

  const { data, error } = useSWRMulticall<Awaited<ReturnType<ChainlinkOracle['getRoundData']>>[]>(
    chainlinkOracleAbi,
    calls,
    {
      use: [laggyMiddleware],
    },
  )

  const computedData: ChartData[] = useMemo(() => {
    return (
      data
        ?.filter((d) => !d || d.answer.gt(0)) // filter out rounds with no data, or positive answer
        .map(({ answer, roundId, startedAt }) => {
          return {
            answer: parseFloat(formatBigNumberToFixed(answer, 3, 8)),
            roundId: roundId.toString(),
            startedAt: startedAt.toNumber(),
          }
        }) ?? []
    )
  }, [data])

  return { data: computedData, error }
}

type ChartData = {
  answer: number
  roundId: string
  startedAt: number
}

const HoverUpdater = ({ payload }) => {
  const mutate = useChartHoverMutate()
  useEffect(() => {
    mutate(payload)
  }, [mutate, payload])

  return null
}

function useChartHover() {
  const { data } = useSWRImmutable<ChartData>('chainlinkChartHover')
  return data
}

function useChartHoverMutate() {
  const { mutate } = useSWRConfig()

  const updateHover = useCallback(
    (data) => {
      mutate('chainlinkChartHover', data)
    },
    [mutate],
  )

  return updateHover
}

const chartColor = { gradient1: '#00E7B0', gradient2: '#0C8B6C', stroke: '#31D0AA' }

const ChainlinkChartWrapper = styled(Flex)<{ isMobile?: boolean }>`
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ theme, isMobile }) => (isMobile ? theme.card.background : theme.colors.gradients.bubblegum)};
`

const HoverData = ({ rounds }: { rounds: { [key: string]: NodeRound } }) => {
  const hoverData = useChartHover()
  const {
    currentLanguage: { locale },
  } = useTranslation()

  if (!hoverData) {
    return null
  }

  return (
    <>
      <PairPriceDisplay alignItems="center" value={hoverData.answer} inputSymbol="BNB" outputSymbol="USDT" />
      <FlexGap minWidth="51%" alignItems="center" gap="12px">
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
            #{rounds[hoverData.roundId].epoch}
          </Text>
        )}
      </FlexGap>
    </>
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
        height={['56px', , , , '44px']}
      >
        <HoverData rounds={rounds} />
      </FlexGap>
      <Flex height={[`calc(100% - 56px)`]}>
        <Chart rounds={rounds} data={data} />
      </Flex>
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
  const { theme } = useTheme()
  const mutate = useChartHoverMutate()

  return (
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
        onMouseLeave={() => {
          mutate(undefined)
        }}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor.gradient1} stopOpacity={0.34} />
            <stop offset="100%" stopColor={chartColor.gradient2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="startedAt"
          tickFormatter={(time) => {
            return new Date(time * 1000).toLocaleString(locale, {
              hour: 'numeric',
              minute: '2-digit',
              hourCycle: 'h24',
            })
          }}
          minTickGap={8}
          reversed
        />
        <XAxis dataKey="roundId" hide />
        <YAxis
          dataKey="answer"
          tickCount={6}
          scale="linear"
          color={theme.colors.textSubtle}
          fontSize="12px"
          domain={['auto', 'auto']}
          orientation="right"
          tick={{ dx: 10, fill: theme.colors.textSubtle }}
        />
        <Tooltip
          cursor={{ stroke: theme.colors.textSubtle, strokeDasharray: '3 3' }}
          contentStyle={{ display: 'none' }}
          formatter={(_, __, props) => <HoverUpdater payload={props.payload} />}
        />
        <Area
          dataKey="answer"
          type="linear"
          stroke={chartColor.stroke}
          fill="url(#gradient)"
          strokeWidth={2}
          activeDot={(props) => {
            if (rounds[props.payload.roundId]) {
              return <ActiveDot {...props} />
            }
            return null
          }}
          dot={(props) => {
            if (rounds[props.payload.roundId]) {
              return <Dot {...props} r={4} fill={chartColor.stroke} fillOpacity={1} strokeWidth={0} />
            }
            return null
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const ActiveDot = (props) => {
  const { swiper } = useSwiper()
  const sortedRounds = useGetSortedRounds()
  const { theme } = useTheme()

  return (
    <Dot
      {...props}
      r={12}
      stroke={theme.colors.primary}
      strokeWidth={10}
      fill={theme.colors.background}
      onClick={() => {
        const roundIndex = sortedRounds.findIndex((round) => round.closeOracleId === props.payload.roundId)
        if (roundIndex >= 0) {
          swiper.slideTo(roundIndex)
        }
      }}
    />
  )
}

export default ChainLinkChart
