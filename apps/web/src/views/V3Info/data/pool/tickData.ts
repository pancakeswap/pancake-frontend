import { gql, GraphQLClient } from 'graphql-request'
import keyBy from 'lodash/keyBy'
import { TickMath, tickToPrice } from '@pancakeswap/v3-sdk'
import { Token, ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

const PRICE_FIXED_DIGITS = 4
const DEFAULT_SURROUNDING_TICKS = 300
const FEE_TIER_TO_TICK_SPACING = (feeTier: string): number => {
  switch (feeTier) {
    case '10000':
      return 200
    case '2500':
      return 50
    case '500':
      return 10
    case '100':
      return 1
    default:
      throw Error(`Tick spacing for fee tier ${feeTier} undefined.`)
  }
}

interface TickPool {
  tick: string
  feeTier: string
  token0: {
    symbol: string
    id: string
    decimals: string
  }
  token1: {
    symbol: string
    id: string
    decimals: string
  }
  sqrtPrice: string
  liquidity: string
}

interface PoolResult {
  pool: TickPool
}

// Raw tick returned from GQL
interface Tick {
  tickIdx: string
  liquidityGross: string
  liquidityNet: string
  price0: string
  price1: string
}

interface SurroundingTicksResult {
  ticks: Tick[]
}

// Tick with fields parsed to bigints, and active liquidity computed.
export interface TickProcessed {
  liquidityGross: bigint
  liquidityNet: bigint
  tickIdx: number
  liquidityActive: bigint
  price0: string
  price1: string
}

const fetchInitializedTicks = async (
  poolAddress: string,
  tickIdxLowerBound: number,
  tickIdxUpperBound: number,
  client: GraphQLClient,
): Promise<{ loading?: boolean; error?: boolean; ticks?: Tick[] }> => {
  const tickQuery = gql`
    query surroundingTicks(
      $poolAddress: String!
      $tickIdxLowerBound: BigInt!
      $tickIdxUpperBound: BigInt!
      $skip: Int!
    ) {
      ticks(
        first: 1000
        skip: $skip
        where: { poolAddress: $poolAddress, tickIdx_lte: $tickIdxUpperBound, tickIdx_gte: $tickIdxLowerBound }
      ) {
        tickIdx
        liquidityGross
        liquidityNet
        price0
        price1
      }
    }
  `

  let surroundingTicks: Tick[] = []
  let surroundingTicksResult: Tick[] = []
  let skip = 0
  do {
    try {
      // eslint-disable-next-line no-await-in-loop
      const data = await client.request<SurroundingTicksResult>(tickQuery, {
        poolAddress,
        tickIdxLowerBound,
        tickIdxUpperBound,
        skip,
      })

      // console.log({ data, error, loading }, 'Result. Skip: ' + skip)

      if (!data) {
        continue
      }
      surroundingTicks = data.ticks
      surroundingTicksResult = surroundingTicksResult.concat(surroundingTicks)
      skip += 1000
    } catch (e) {
      console.error(e)
      return { error: true, ticks: surroundingTicksResult }
    }
  } while (surroundingTicks.length > 0)
  return { ticks: surroundingTicksResult, loading: false, error: false }
}

export interface PoolTickData {
  ticksProcessed: TickProcessed[]
  feeTier: string
  tickSpacing: number
  activeTickIdx: number
}

const poolQuery = gql`
  query pool($poolAddress: ID!) {
    pool(id: $poolAddress) {
      tick
      token0 {
        symbol
        id
        decimals
      }
      token1 {
        symbol
        id
        decimals
      }
      feeTier
      sqrtPrice
      liquidity
    }
  }
`

export const fetchTicksSurroundingPrice = async (
  poolAddress: string,
  client: GraphQLClient,
  chainId: ChainId,
  numSurroundingTicks = DEFAULT_SURROUNDING_TICKS,
): Promise<{
  error?: boolean
  data?: PoolTickData
}> => {
  try {
    const poolResult = await client.request<PoolResult>(poolQuery, {
      poolAddress,
    })
    const {
      pool: {
        tick: poolCurrentTick,
        feeTier,
        liquidity,
        token0: { id: token0Address, decimals: token0Decimals, symbol: token0Symbol },
        token1: { id: token1Address, decimals: token1Decimals, symbol: token1Symbol },
      },
    } = poolResult
    const poolCurrentTickIdx = parseInt(poolCurrentTick)
    const tickSpacing = FEE_TIER_TO_TICK_SPACING(feeTier)
    // The pools current tick isn't necessarily a tick that can actually be initialized.
    // Find the nearest valid tick given the tick spacing.
    const activeTickIdx = Math.floor(poolCurrentTickIdx / tickSpacing) * tickSpacing

    // Our search bounds must take into account fee spacing. i.e. for fee tier 1%, only
    // ticks with index 200, 400, 600, etc can be active.
    const tickIdxLowerBound = activeTickIdx - numSurroundingTicks * tickSpacing
    const tickIdxUpperBound = activeTickIdx + numSurroundingTicks * tickSpacing

    const initializedTicksResult = await fetchInitializedTicks(
      poolAddress,
      tickIdxLowerBound,
      tickIdxUpperBound,
      client,
    )
    if (initializedTicksResult.error || initializedTicksResult.loading) {
      return {
        error: initializedTicksResult.error,
      }
    }

    const { ticks: initializedTicks } = initializedTicksResult

    const tickIdxToInitializedTick = keyBy(initializedTicks, 'tickIdx')

    const token0 = new Token(chainId, token0Address as Address, parseInt(token0Decimals), token0Symbol)
    const token1 = new Token(chainId, token1Address as Address, parseInt(token1Decimals), token1Symbol)

    // console.log({ activeTickIdx, poolCurrentTickIdx }, 'Active ticks')

    // If the pool's tick is MIN_TICK (-887272), then when we find the closest
    // initializable tick to its left, the value would be smaller than MIN_TICK.
    // In this case we must ensure that the prices shown never go below/above.
    // what actual possible from the protocol.
    let activeTickIdxForPrice = activeTickIdx
    if (activeTickIdxForPrice < TickMath.MIN_TICK) {
      activeTickIdxForPrice = TickMath.MIN_TICK
    }
    if (activeTickIdxForPrice > TickMath.MAX_TICK) {
      activeTickIdxForPrice = TickMath.MAX_TICK
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: BigInt(liquidity),
      tickIdx: activeTickIdx,
      liquidityNet: 0n,
      price0: tickToPrice(token0, token1, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
      price1: tickToPrice(token1, token0, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
      liquidityGross: 0n,
    }

    // If our active tick happens to be initialized (i.e. there is a position that starts or
    // ends at that tick), ensure we set the gross and net.
    // correctly.
    const activeTick = tickIdxToInitializedTick[activeTickIdx]
    if (activeTick) {
      activeTickProcessed.liquidityGross = BigInt(activeTick.liquidityGross)
      activeTickProcessed.liquidityNet = BigInt(activeTick.liquidityNet)
    }

    enum Direction {
      ASC,
      DESC,
    }

    // Computes the numSurroundingTicks above or below the active tick.
    const computeSurroundingTicks = (
      activeTickProcessedParam: TickProcessed,
      tickSpacingParam: number,
      numSurroundingTicksParam: number,
      direction: Direction,
    ) => {
      let previousTickProcessed: TickProcessed = {
        ...activeTickProcessedParam,
      }

      // Iterate outwards (either up or down depending on 'Direction') from the active tick,
      // building active liquidity for every tick.
      let processedTicks: TickProcessed[] = []
      for (let i = 0; i < numSurroundingTicksParam; i++) {
        const currentTickIdx =
          direction === Direction.ASC
            ? previousTickProcessed.tickIdx + tickSpacingParam
            : previousTickProcessed.tickIdx - tickSpacingParam
        // console.log(currentTickIdx, 'currentTickIdx??????')

        if (currentTickIdx < TickMath.MIN_TICK || currentTickIdx > TickMath.MAX_TICK) {
          break
        }

        const currentTickProcessed: TickProcessed = {
          liquidityActive: previousTickProcessed.liquidityActive,
          tickIdx: currentTickIdx,
          liquidityNet: 0n,
          price0: tickToPrice(token0, token1, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
          price1: tickToPrice(token1, token0, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
          liquidityGross: 0n,
        }

        // Check if there is an initialized tick at our current tick.
        // If so copy the gross and net liquidity from the initialized tick.
        const currentInitializedTick = tickIdxToInitializedTick[currentTickIdx.toString()]
        if (currentInitializedTick) {
          currentTickProcessed.liquidityGross = BigInt(currentInitializedTick.liquidityGross)
          currentTickProcessed.liquidityNet = BigInt(currentInitializedTick.liquidityNet)
        }

        // Update the active liquidity.
        // If we are iterating ascending and we found an initialized tick we immediately apply
        // it to the current processed tick we are building.
        // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
        if (direction === Direction.ASC && currentInitializedTick) {
          currentTickProcessed.liquidityActive =
            previousTickProcessed.liquidityActive + BigInt(currentInitializedTick.liquidityNet)
        } else if (direction === Direction.DESC && previousTickProcessed.liquidityNet !== 0n) {
          // We are iterating descending, so look at the previous tick and apply any net liquidity.
          currentTickProcessed.liquidityActive =
            previousTickProcessed.liquidityActive - previousTickProcessed.liquidityNet
        }

        processedTicks.push(currentTickProcessed)
        previousTickProcessed = currentTickProcessed
      }

      if (direction === Direction.DESC) {
        processedTicks = processedTicks.reverse()
      }

      return processedTicks
    }

    const subsequentTicks: TickProcessed[] = computeSurroundingTicks(
      activeTickProcessed,
      tickSpacing,
      numSurroundingTicks,
      Direction.ASC,
    )

    const previousTicks: TickProcessed[] = computeSurroundingTicks(
      activeTickProcessed,
      tickSpacing,
      numSurroundingTicks,
      Direction.DESC,
    )

    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)
    return {
      data: {
        ticksProcessed,
        feeTier,
        tickSpacing,
        activeTickIdx,
      },
    }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}
