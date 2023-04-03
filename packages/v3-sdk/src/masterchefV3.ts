import { Interface } from '@ethersproject/abi'
import { BigintIsh, CurrencyAmount, ONE, Token, validateAndParseAddress, ZERO } from '@pancakeswap/sdk'
import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { ADDRESS_ZERO } from './constants'
import { Position } from './entities'
import { Multicall } from './multicall'
import IMasterChefABI from './abi/MasterChefV3.json'

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
  public static INTERFACE: Interface = new Interface(IMasterChefABI)

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line
  private constructor() {}

  // Copy from NonfungiblePositionManager
  // Only support increaseLiquidity
  public static addCallParameters(position: Position, options: AddLiquidityOptions): MethodParameters {
    invariant(JSBI.greaterThan(position.liquidity, ZERO), 'ZERO_LIQUIDITY')

    const calldatas: string[] = []

    // get amounts
    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts

    // adjust for slippage
    const minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance)
    const amount0Min = toHex(minimumAmounts.amount0)
    const amount1Min = toHex(minimumAmounts.amount1)

    const deadline = toHex(options.deadline)

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
      MasterChefV3.INTERFACE.encodeFunctionData('increaseLiquidity', [
        {
          tokenId: toHex(options.tokenId),
          amount0Desired: toHex(amount0Desired),
          amount1Desired: toHex(amount1Desired),
          amount0Min,
          amount1Min,
          deadline,
        },
      ])
    )

    let value: string = toHex(0)

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
  private static encodeCollect(options: CollectOptions): string[] {
    const calldatas: string[] = []

    const tokenId = toHex(options.tokenId)

    const involvesETH =
      options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative

    const recipient = validateAndParseAddress(options.recipient)

    // collect
    calldatas.push(
      MasterChefV3.INTERFACE.encodeFunctionData('collect', [
        {
          tokenId,
          recipient: involvesETH ? ADDRESS_ZERO : recipient,
          amount0Max: MaxUint128,
          amount1Max: MaxUint128,
        },
      ])
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
    const calldatas: string[] = MasterChefV3.encodeCollect(options)

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  public static removeCallParameters(position: Position, options: RemoveLiquidityOptions): MethodParameters {
    const calldatas: string[] = []

    const deadline = toHex(options.deadline)
    const tokenId = toHex(options.tokenId)

    // construct a partial position with a percentage of liquidity
    const partialPosition = new Position({
      pool: position.pool,
      liquidity: options.liquidityPercentage.multiply(position.liquidity).quotient,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
    })
    invariant(JSBI.greaterThan(partialPosition.liquidity, ZERO), 'ZERO_LIQUIDITY')

    // slippage-adjusted underlying amounts
    const { amount0: amount0Min, amount1: amount1Min } = partialPosition.burnAmountsWithSlippage(
      options.slippageTolerance
    )

    if (options.permit) {
      calldatas.push(
        MasterChefV3.INTERFACE.encodeFunctionData('permit', [
          validateAndParseAddress(options.permit.spender),
          tokenId,
          toHex(options.permit.deadline),
          options.permit.v,
          options.permit.r,
          options.permit.s,
        ])
      )
    }

    // remove liquidity
    calldatas.push(
      MasterChefV3.INTERFACE.encodeFunctionData('decreaseLiquidity', [
        {
          tokenId,
          liquidity: toHex(partialPosition.liquidity),
          amount0Min: toHex(amount0Min),
          amount1Min: toHex(amount1Min),
          deadline,
        },
      ])
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
          MasterChefV3.INTERFACE.encodeFunctionData('withdraw', [
            tokenId.toString(),
            validateAndParseAddress(rest?.recipient),
          ])
        )
      } else {
        calldatas.push(
          MasterChefV3.INTERFACE.encodeFunctionData('harvest', [
            tokenId.toString(),
            validateAndParseAddress(rest?.recipient),
          ])
        )
      }
    }

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(MasterChefV3.INTERFACE.encodeFunctionData('burn', [tokenId]))
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
    const calldatas: string[] = this.encodeHarvest(options)

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  public static batchHarvestCallParameters(options: HarvestOptions[]) {
    const calldatas: string[] = options.map((option) => this.encodeHarvest(option)).flat()

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  private static encodeHarvest(options: HarvestOptions) {
    const { tokenId, to } = options

    const calldatas: string[] = []

    // harvest pendingCake
    calldatas.push(
      MasterChefV3.INTERFACE.encodeFunctionData('harvest', [tokenId.toString(), validateAndParseAddress(to)])
    )

    return calldatas
  }

  public static withdrawCallParameters(options: WidthDrawOptions) {
    const { tokenId, to } = options

    const calldatas: string[] = []

    // withdraw liquidity
    calldatas.push(
      MasterChefV3.INTERFACE.encodeFunctionData('withdraw', [tokenId.toString(), validateAndParseAddress(to)])
    )

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }
}
