import { TradeType, validateAndParseAddress } from '@pancakeswap/sdk'
import { PoolType, RouteType, SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router'
import invariant from 'tiny-invariant'
import { CONTRACT_BALANCE, ROUTER_AS_RECIPIENT, SENDER_AS_RECIPIENT } from '../../constants'
import { PancakeSwapOptions, SwapSection } from '../types'

export const parseSwapSection = (
  trade: Omit<SmartRouterTrade<TradeType>, 'gasEstimate'>,
  options: PancakeSwapOptions,
): SwapSection[] => {
  const swaps: SwapSection[] = []
  for (let k = 0; k < trade.routes.length; k++) {
    const route = trade.routes[k]
    const sections = SmartRouter.partitionMixedRouteByProtocol(route)

    const amountIn = SmartRouter.maximumAmountIn(trade, options.slippageTolerance, route.inputAmount).quotient
    const amountOut: bigint = SmartRouter.minimumAmountOut(
      trade,
      options.slippageTolerance,
      route.outputAmount,
    ).quotient
    let currentCurrency = trade.inputAmount.currency
    const numberOfTrades = trade.routes.length
    const outputIsNative = trade.outputAmount.currency.isNative
    const performAggregatedSlippageCheck = trade.tradeType === TradeType.EXACT_INPUT && numberOfTrades > 2
    const routerMustCustody = outputIsNative || !!options.fee || performAggregatedSlippageCheck

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]

      invariant(section.length, 'EMPTY_SECTION')
      const type = poolTypeToRouteType(section[0].type)

      invariant(
        section.every((pool) => pool.type === section[0].type),
        'MIXED_POOL_TYPES',
      )
      invariant(
        type === RouteType.V2 ||
          type === RouteType.V3 ||
          type === RouteType.V4BIN ||
          type === RouteType.V4CL ||
          type === RouteType.STABLE,
        'INVALID_ROUTE_TYPE',
      )

      const inputToken = SmartRouter.getInputOfPools(section)
      const outputToken = SmartRouter.getOutputOfPools(section, inputToken)
      const newRoute = SmartRouter.buildBaseRoute([...section], inputToken, outputToken)
      const isFirstSection = i === 0
      const isLastSection = i === sections.length - 1
      const inAmount = isFirstSection ? amountIn : CONTRACT_BALANCE
      const outAmount = isLastSection ? amountOut : 0n
      const needsWrapInput = currentCurrency.isNative && !inputToken.isNative
      currentCurrency = outputToken
      const nextInput = sections[i + 1] ? SmartRouter.getInputOfPools(sections[i + 1]) : route.outputAmount.currency
      const needsUnwrapOutput = !currentCurrency.isNative && nextInput.isNative

      const recipient = routerMustCustody
        ? ROUTER_AS_RECIPIENT
        : validateAndParseAddress(options.recipient ?? SENDER_AS_RECIPIENT)

      const swap: SwapSection = {
        type,
        tradeType: trade.tradeType,
        inAmount,
        outAmount,
        route: newRoute,
        needsWrapInput,
        needsUnwrapOutput,
        recipient,
        isLastOfRoute: isLastSection,
        isFinal: isLastSection && k === trade.routes.length - 1,
        optionRecipient: options.recipient,
        trade,
      }
      swaps.push(swap)
    }
  }
  return swaps
}

function poolTypeToRouteType(poolType: PoolType): RouteType {
  switch (poolType) {
    case PoolType.V2:
      return RouteType.V2
    case PoolType.V3:
      return RouteType.V3
    case PoolType.STABLE:
      return RouteType.STABLE
    case PoolType.V4CL:
      return RouteType.V4CL
    case PoolType.V4BIN:
      return RouteType.V4BIN
    default:
      throw new Error('Invalid pool type')
  }
}
