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
import { useGetSortedRounds } from 'state/predictions/hooks'
import styled from 'styled-components'

const chainlinkAddress = getChainlinkOracleAddress()
function useChainlinkRoundDataSet() {
  const chainlinkOracleContract = useChainlinkOracleContract()
  const lastRound = useSWRContract([chainlinkOracleContract, 'latestRound'])

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
      data?.map(({ answer, roundId, startedAt }, i) => {
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
  return useSWRImmutable('chainlinkChartHover')
}

const chartColor = { gradient1: '#00E7B0', gradient2: '#0C8B6C', stroke: '#31D0AA' }

const ChainlinkChartWrapper = styled.div`
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
  const { theme } = useTheme()
  const { data } = useChainlinkRoundDataSet()
  const rounds = useGetSortedRounds()
  const containerRef = useRef()

  if (!data.length) {
    return <LineChartLoader />
  }

  return (
    <ChainlinkChartWrapper>
      <ResponsiveContainer ref={containerRef}>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          // onMouseLeave={() => {
          //   if (setHoverDate) setHoverDate(undefined)
          //   if (setHoverValue) setHoverValue(undefined)
          // }}
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
                hour: '2-digit',
                minute: '2-digit',
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
            cursor={{ stroke: theme.colors.textDisabled }}
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
              if (rounds.some((r) => r.closeOracleId === props.payload.roundId)) {
                return <Dot {...props} r={5} stroke={chartColor.stroke} strokeWidth={3} fill={0} />
              }
              return null
            }}
            dot={(props) => {
              if (rounds.some((r) => r.closeOracleId === props.payload.roundId)) {
                return <Dot {...props} r={4} fill={chartColor.stroke} fillOpacity={1} strokeWidth={0} />
              }
              return null
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChainlinkChartWrapper>
  )
}
