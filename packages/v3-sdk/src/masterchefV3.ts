import { encodeFunctionData, Hex } from 'viem'
import { BigintIsh, CurrencyAmount, ONE, Token, validateAndParseAddress, ZERO } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'
import { ADDRESS_ZERO } from './constants'
import { Position } from './entities'
import { Multicall } from './multicall'
import { masterChefV3ABI } from './abi/MasterChefV3'

import {
  type AddLiquidityOptions,
  isMint,
  CollectOptions,
  MaxUint128,
  type RemoveLiquidityOptions,
} from './nonfungiblePositionManager'
import { Payments } from './payments'
import { SelfPermit } from './selfPermit'
import { MethodParameters, toHex } from './utils'

interface WidthDrawOptions {
  tokenId: BigintIsh
  to: string
}

interface HarvestOptions {
  tokenId: BigintIsh
  to: string
}

export abstract class MasterChefV3 {
  public static ABI = masterChefV3ABI

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line
  private constructor() {}

  // Copy from NonfungiblePositionManager
  // Only support increaseLiquidity
  public static addCallParameters(position: Position, options: AddLiquidityOptions): MethodParameters {
    invariant(position.liquidity > ZERO, 'ZERO_LIQUIDITY')

    const calldatas: Hex[] = []

    // get amounts
    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts

    // adjust for slippage
    const minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance)
    const amount0Min = BigInt(minimumAmounts.amount0)
    const amount1Min = BigInt(minimumAmounts.amount1)

    const deadline = BigInt(options.deadline)

    invariant(!isMint(options), 'NO_MINT_SUPPORT')

    // permits if necessary
    if (options.token0Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit))
    }
    if (options.token1Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit))
    }

    // increase
    calldatas.push(
      encodeFunctionData({
        abi: MasterChefV3.ABI,
        functionName: 'increaseLiquidity',
        args: [
          {
            tokenId: BigInt(options.tokenId),
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            deadline,
          },
        ],
      })
    )

    let value: Hex = toHex(0)

    if (options.useNative) {
      const { wrapped } = options.useNative
      invariant(position.pool.token0.equals(wrapped) || position.pool.token1.equals(wrapped), 'NO_WETH')

      const wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired

      // // we only need to refund if we're actually sending ETH
      // if (JSBI.greaterThan(wrappedValue, ZERO)) {
      //   calldatas.push(Payments.encodeRefundETH())
      // }

      value = toHex(wrappedValue)
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value,
    }
  }

  // Copy from NonfungiblePositionManager
  private static encodeCollect(options: CollectOptions): Hex[] {
    const calldatas: Hex[] = []

    const tokenId = BigInt(options.tokenId)

    const involvesETH =
      options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative

    const recipient = validateAndParseAddress(options.recipient)

    // collect
    calldatas.push(
      encodeFunctionData({
        abi: MasterChefV3.ABI,
        functionName: 'collect',
        args: [
          {
            tokenId,
            recipient: involvesETH ? ADDRESS_ZERO : recipient,
            amount0Max: MaxUint128,
            amount1Max: MaxUint128,
          },
        ],
      })
    )

    if (involvesETH) {
      const ethAmount = options.expectedCurrencyOwed0.currency.isNative
        ? options.expectedCurrencyOwed0.quotient
        : options.expectedCurrencyOwed1.quotient
      const token = options.expectedCurrencyOwed0.currency.isNative
        ? (options.expectedCurrencyOwed1.currency as Token)
        : (options.expectedCurrencyOwed0.currency as Token)
      const tokenAmount = options.expectedCurrencyOwed0.currency.isNative
        ? options.expectedCurrencyOwed1.quotient
        : options.expectedCurrencyOwed0.quotient

      calldatas.push(Payments.encodeUnwrapWETH9(ethAmount, recipient))
      calldatas.push(Payments.encodeSweepToken(token, tokenAmount, recipient))
    }

    return calldatas
  }

  public static collectCallParameters(options: CollectOptions): MethodParameters {
    const calldatas: Hex[] = MasterChefV3.encodeCollect(options)

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  public static removeCallParameters(position: Position, options: RemoveLiquidityOptions): MethodParameters {
    const calldatas: Hex[] = []

    const deadline = BigInt(options.deadline)
    const tokenId = BigInt(options.tokenId)

    // construct a partial position with a percentage of liquidity
    const partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
    })
    invariant(partialPosition.liquidity > ZERO, 'ZERO_LIQUIDITY')

    // slippage-adjusted underlying amounts
    const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
      options.slippageTolerance
    )

    if (options.permit) {
      throw new Error('NOT_IMPLEMENTED')
      // calldatas.push(
      //   MasterChefV3.INTERFACE.encodeFunctionData('permit', [
      //     validateAndParseAddress(options.permit.spender),
      //     tokenId,
      //     toHex(options.permit.deadline),
      //     options.permit.v,
      //     options.permit.r,
      //     options.permit.s,
      //   ])
      // )
    }

    // remove liquidity
    calldatas.push(
      encodeFunctionData({
        abi: MasterChefV3.ABI,
        functionName: 'decreaseLiquidity',
        args: [
          {
            tokenId,
            liquidity: partialPosition.liquidity,
            amount0Min,
            amount1Min,
            deadline,
          },
        ],
      })
    )

    const { expectedCurrencyOwed0, expectedCurrencyOwed1, ...rest } = options.collectOptions
    calldatas.push(
      ...MasterChefV3.encodeCollect({
        tokenId: toHex(options.tokenId),
        // add the underlying value to the expected currency already owed
        expectedCurrencyOwed0: expectedCurrencyOwed0.add(
          CurrencyAmount.fromRawAmount(expectedCurrencyOwed0.currency, amount0Min)
        ),
        expectedCurrencyOwed1: expectedCurrencyOwed1.add(
          CurrencyAmount.fromRawAmount(expectedCurrencyOwed1.currency, amount1Min)
        ),
        ...rest,
      })
    )

    if (rest?.recipient) {
      if (options.liquidityPercentage.equalTo(ONE)) {
        calldatas.push(
          encodeFunctionData({
            abi: MasterChefV3.ABI,
            functionName: 'withdraw',
            args: [tokenId, validateAndParseAddress(rest?.recipient)],
          })
        )
      } else {
        calldatas.push(
          encodeFunctionData({
            abi: MasterChefV3.ABI,
            functionName: 'harvest',
            args: [tokenId, validateAndParseAddress(rest?.recipient)],
          })
        )
      }
    }

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(encodeFunctionData({ abi: MasterChefV3.ABI, functionName: 'burn', args: [tokenId] }))
      }
    } else {
      invariant(options.burnToken !== true, 'CANNOT_BURN')
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  // public static updateCallParameters() {}

  public static harvestCallParameters(options: HarvestOptions) {
    const calldatas: Hex[] = this.encodeHarvest(options)

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  public static batchHarvestCallParameters(options: HarvestOptions[]) {
    const calldatas: Hex[] = options.map((option) => this.encodeHarvest(option)).flat()

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  public static encodeHarvest(options: HarvestOptions) {
    const { tokenId, to } = options

    const calldatas: Hex[] = []

    // harvest pendingCake
    calldatas.push(
      encodeFunctionData({
        abi: MasterChefV3.ABI,
        functionName: 'harvest',
        args: [BigInt(tokenId), validateAndParseAddress(to)],
      })
    )

    return calldatas
  }

  public static withdrawCallParameters(options: WidthDrawOptions) {
    const { tokenId, to } = options

    const calldatas: Hex[] = []

    // withdraw liquidity
    calldatas.push(
      encodeFunctionData({
        abi: MasterChefV3.ABI,
        functionName: 'withdraw',
        args: [BigInt(tokenId), validateAndParseAddress(to)],
      })
    )

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }
}
