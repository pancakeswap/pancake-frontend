import React, { useEffect, Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, Dot } from 'recharts'
import useTheme from 'hooks/useTheme'
import { LineChartLoader } from 'views/Info/components/ChartLoaders'
import { useTranslation } from 'contexts/Localization'
import { laggyMiddleware, useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import useSWRImmutable from 'swr/immutable'
import { useChainlinkOracleContract } from 'hooks/useContract'
import { getChainlinkOracleAddress } from 'utils/addressHelpers'
import { ChainlinkOracle } from 'config/abi/types'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { useGetRoundsByCloseOracleId } from 'state/predictions/hooks'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import PairPriceDisplay from 'components/PairPriceDisplay'
import { NodeRound } from 'state/types'

const chainlinkAddress = getChainlinkOracleAddress()
function useChainlinkRoundDataSet() {
  const chainlinkOracleContract = useChainlinkOracleContract()
  const lastRound = useSWRContract([chainlinkOracleContract, 'latestRound'], {
    use: [laggyMiddleware],
  })

  const calls = useMemo(() => {
    return lastRound.data
      ? Array.from({ length: 100 }).map((_, i) => ({
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
      data?.map(({ answer, roundId, startedAt }) => {
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

export type SwapLineChartProps = {
  data: any[]
  setHoverValue: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setHoverDate: Dispatch<SetStateAction<string | undefined>> // used for label of valye
  isChangePositive: boolean
} & React.HTMLAttributes<HTMLDivElement>

const HoverUpdater = ({ payload }) => {
  const { mutate } = useChartHover()
  useEffect(() => {
    mutate(payload)
  }, [mutate, payload])

  return null
}

function useChartHover() {
  return useSWRImmutable<ChartData>('chainlinkChartHover')
}

const chartColor = { gradient1: '#00E7B0', gradient2: '#0C8B6C', stroke: '#31D0AA' }

const ChainlinkChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`

/**
 * Note: remember that it needs to be mounted inside the container with fixed height
 */
export const ChainLinkChart = () => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const { data } = useChainlinkRoundDataSet()
  const rounds = useGetRoundsByCloseOracleId()
  const { data: hoverData } = useChartHover()

  if (!data.length) {
    return <LineChartLoader />
  }

  return (
    <ChainlinkChartWrapper>
      <Flex flexDirection="row" pt="12px" px="20px" alignItems="center" style={{ gap: '8px', height: '44px' }}>
        {hoverData && (
          <>
            <PairPriceDisplay alignItems="center" value={hoverData.answer} inputSymbol="BNB" outputSymbol="USDT">
              {/* <Text color={isChangePositive ? 'success' : 'failure'} fontSize="20px" mt="-8px" mb="8px" bold>
            {`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
          </Text> */}
            </PairPriceDisplay>
            <Text color="textSubtle">
              {new Date(hoverData.startedAt * 1000).toLocaleString(locale, {
                year: 'numeric',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {rounds[hoverData.roundId] && (
              <Text fontSize="20px" color="secondary" bold>
                #{rounds[hoverData.roundId].epoch}
              </Text>
            )}
          </>
        )}
      </Flex>
      <Flex flex={1}>
        <Chart rounds={rounds} data={data} />
      </Flex>
    </ChainlinkChartWrapper>
  )
}

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
  const containerRef = useRef()
  const { mutate } = useChartHover()

  return (
    <ResponsiveContainer ref={containerRef}>
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
              return (
                <Dot {...props} r={12} stroke={theme.colors.primary} strokeWidth={10} fill={theme.colors.background} />
              )
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
