import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { Flex, Spinner } from '@pancakeswap/uikit'
import { FeeAmount, Pool, TICK_SPACINGS, TickMath } from '@pancakeswap/v3-sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'
import { MAX_UINT128 } from '../../constants'
import { TickProcessed } from '../../data/pool/tickData'
import { usePoolData, usePoolTickData } from '../../hooks'
import { DensityChartEntry, PoolData } from '../../types'
import { CurrentPriceLabel } from './CurrentPriceLabel'
import CustomToolTip from './CustomToolTip'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
`

const ControlsWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 100px;
  padding: 4px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 6px;
`

const ActionButton = styled.div<{ disabled?: boolean }>`
  width: 32x;
  border-radius: 50%;
  background-color: black;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 0.9)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.colors.backgroundAlt2 : theme.colors.backgroundAlt)};
  user-select: none;

  &:hover {
    cursor: pointer;
    opacity: 0.4;
  }
`

interface DensityChartProps {
  address: string
}

interface ZoomStateProps {
  left: number
  right: number
  refAreaLeft: string | number
  refAreaRight: string | number
}

const INITIAL_TICKS_TO_FETCH = 200
const ZOOM_INTERVAL = 20

const initialState = {
  left: 0,
  right: INITIAL_TICKS_TO_FETCH * 3 - 1,
  refAreaLeft: '',
  refAreaRight: '',
}

export default function DensityChart({ address }: DensityChartProps) {
  // poolData
  const poolData: PoolData | undefined = usePoolData(address)
  const formattedAddress0 = safeGetAddress(poolData?.token0?.address)
  const formattedAddress1 = safeGetAddress(poolData?.token1?.address)
  const feeTier = poolData?.feeTier

  // parsed tokens
  const token0 = useMemo(() => {
    return poolData && formattedAddress0 && formattedAddress1
      ? new Token(1, formattedAddress0, poolData.token0.decimals, poolData.token0.symbol)
      : undefined
  }, [formattedAddress0, formattedAddress1, poolData])
  const token1 = useMemo(() => {
    return poolData && formattedAddress1 && formattedAddress1
      ? new Token(1, formattedAddress1, poolData.token1.decimals, poolData.token1.symbol)
      : undefined
  }, [formattedAddress1, poolData])

  // tick data tracking
  const poolTickData = usePoolTickData(address)
  const [ticksToFetch, setTicksToFetch] = useState(INITIAL_TICKS_TO_FETCH)
  const amountTicks = ticksToFetch * 2 + 1

  const [loading, setLoading] = useState(false)
  const [zoomState, setZoomState] = useState<ZoomStateProps>(initialState)

  const [formattedData, setFormattedData] = useState<DensityChartEntry[] | undefined>()
  useEffect(() => {
    async function formatData() {
      if (poolTickData && poolData?.feeTier) {
        const newData = await Promise.all(
          poolTickData.ticksProcessed.map(async (t: TickProcessed, i) => {
            const active = t.tickIdx === poolTickData.activeTickIdx
            const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(t.tickIdx)
            const feeAmount: FeeAmount = poolData?.feeTier
            const mockTicks = [
              {
                index: t.tickIdx - TICK_SPACINGS[feeAmount],
                liquidityGross: t.liquidityGross,
                liquidityNet: t.liquidityNet * BigInt('-1'),
              },
              {
                index: t.tickIdx,
                liquidityGross: t.liquidityGross,
                liquidityNet: t.liquidityNet,
              },
            ]
            const pool =
              token0 && token1 && feeTier
                ? new Pool(token0, token1, feeTier, sqrtPriceX96, t.liquidityActive, t.tickIdx, mockTicks)
                : undefined
            const nextSqrtX96 = poolTickData.ticksProcessed[i - 1]
              ? TickMath.getSqrtRatioAtTick(poolTickData.ticksProcessed[i - 1].tickIdx)
              : undefined
            const maxAmountToken0 = token0 ? CurrencyAmount.fromRawAmount(token0, MAX_UINT128) : undefined
            const outputRes0 =
              pool && maxAmountToken0 ? await pool.getOutputAmount(maxAmountToken0, nextSqrtX96) : undefined

            const token1Amount = outputRes0?.[0] as CurrencyAmount<Token> | undefined

            const amount0 = token1Amount ? parseFloat(token1Amount.toExact()) * parseFloat(t.price1) : 0
            const amount1 = token1Amount ? parseFloat(token1Amount.toExact()) : 0

            return {
              index: i,
              isCurrent: active,
              activeLiquidity: parseFloat(t.liquidityActive.toString()),
              price0: parseFloat(t.price0),
              price1: parseFloat(t.price1),
              tvlToken0: amount0,
              tvlToken1: amount1,
            }
          }),
        )
        // offset the values to line off bars with TVL used to swap across bar
        newData?.forEach((entry, i) => {
          if (i > 0) {
            newData[i - 1].tvlToken0 = entry.tvlToken0
            newData[i - 1].tvlToken1 = entry.tvlToken1
          }
        })

        if (newData) {
          if (loading) {
            setLoading(false)
          }
          setFormattedData(newData)
        }
      }
      return []
    }
    if (!formattedData) {
      formatData()
    }
  }, [feeTier, formattedData, loading, poolData?.feeTier, poolTickData, token0, token1])

  const atZoomMax = zoomState.left + ZOOM_INTERVAL >= zoomState.right - ZOOM_INTERVAL - 1
  const atZoomMin = zoomState.left - ZOOM_INTERVAL < 0

  const handleZoomIn = useCallback(() => {
    if (!atZoomMax)
      setZoomState({
        ...zoomState,
        left: zoomState.left + ZOOM_INTERVAL,
        right: zoomState.right - ZOOM_INTERVAL,
      })
  }, [zoomState, atZoomMax])

  const handleZoomOut = useCallback(() => {
    if (atZoomMin) {
      setLoading(true)
      setTicksToFetch(ticksToFetch + ZOOM_INTERVAL)
      setFormattedData(undefined)
      setZoomState({
        ...zoomState,
        left: 0,
        right: amountTicks,
      })
    } else {
      setZoomState({
        ...zoomState,
        left: zoomState.left - ZOOM_INTERVAL,
        right: zoomState.right + ZOOM_INTERVAL,
      })
    }
  }, [amountTicks, atZoomMin, ticksToFetch, zoomState])

  const zoomedData = useMemo(() => {
    if (formattedData) {
      return formattedData.slice(zoomState.left, zoomState.right)
    }
    return undefined
  }, [formattedData, zoomState.left, zoomState.right])

  // reset data on address change
  useEffect(() => {
    setFormattedData(undefined)
  }, [address])

  if (!poolTickData) {
    return (
      <Flex mt="80px" justifyContent="center">
        <Spinner />
      </Flex>
    )
  }

  const CustomBar = ({
    x,
    y,
    width,
    height,
    fill,
  }: {
    x: number
    y: number
    width: number
    height: number
    fill: string
  }) => {
    return (
      <g>
        <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
      </g>
    )
  }
  return (
    <Wrapper>
      {!loading ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={zoomedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <Tooltip
              content={(props) => (
                <CustomToolTip chartProps={props} poolData={poolData} currentPrice={poolData?.token0Price ?? 0} />
              )}
            />
            <XAxis reversed tick={false} />
            <Bar
              dataKey="activeLiquidity"
              fill="#2172E5"
              isAnimationActive={false}
              shape={(props) => {
                // eslint-disable-next-line react/prop-types
                return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={props.fill} />
              }}
            >
              {zoomedData?.map((entry) => {
                return <Cell key={`cell-${entry.index}`} fill={entry.isCurrent ? '#ED4B9E' : '#31D0AA'} />
              })}
              <LabelList
                dataKey="activeLiquidity"
                position="inside"
                content={(props) =>
                  poolData ? <CurrentPriceLabel chartProps={props} poolData={poolData} data={zoomedData} /> : null
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
      <ControlsWrapper>
        <ActionButton disabled={false} onClick={handleZoomOut}>
          -
        </ActionButton>
        <ActionButton disabled={atZoomMax} onClick={handleZoomIn}>
          +
        </ActionButton>
      </ControlsWrapper>
    </Wrapper>
  )
}
