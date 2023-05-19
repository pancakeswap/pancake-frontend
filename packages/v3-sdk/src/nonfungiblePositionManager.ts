import {
  BigintIsh,
  Percent,
  Token,
  CurrencyAmount,
  Currency,
  NativeCurrency,
  validateAndParseAddress,
} from '@pancakeswap/sdk'
import { Address, encodeFunctionData, Hex } from 'viem'

import invariant from 'tiny-invariant'
import { nonfungiblePositionManagerABI } from './abi/NonfungiblePositionManager'
import { Position } from './entities/position'
import { ONE, ZERO } from './internalConstants'
import { MethodParameters, toHex } from './utils/calldata'
import { PermitOptions, SelfPermit } from './selfPermit'
import { ADDRESS_ZERO } from './constants'
import { Pool } from './entities'
import { Multicall } from './multicall'
import { Payments } from './payments'

export const MaxUint128 = 2n ** 128n - 1n

export interface MintSpecificOptions {
  /**
   * The account that should receive the minted NFT.
   */
  recipient: Address

  /**
   * Creates pool if not initialized before mint.
   */
  createPool?: boolean
}

export interface IncreaseSpecificOptions {
  /**
   * Indicates the ID of the position to increase liquidity for.
   */
  tokenId: BigintIsh
}

/**
 * Options for producing the calldata to add liquidity.
 */
export interface CommonAddLiquidityOptions {
  /**
   * How much the pool price is allowed to move.
   */
  slippageTolerance: Percent

  /**
   * When the transaction expires, in epoch seconds.
   */
  deadline: BigintIsh

  /**
   * Whether to spend ether. If true, one of the pool tokens must be WETH, by default false
   */
  useNative?: NativeCurrency

  /**
   * The optional permit parameters for spending token0
   */
  token0Permit?: PermitOptions

  /**
   * The optional permit parameters for spending token1
   */
  token1Permit?: PermitOptions
}

export type MintOptions = CommonAddLiquidityOptions & MintSpecificOptions
export type IncreaseOptions = CommonAddLiquidityOptions & IncreaseSpecificOptions

export type AddLiquidityOptions = MintOptions | IncreaseOptions

export interface SafeTransferOptions {
  /**
   * The account sending the NFT.
   */
  sender: Address

  /**
   * The account that should receive the NFT.
   */
  recipient: Address

  /**
   * The id of the token being sent.
   */
  tokenId: BigintIsh
  /**
   * The optional parameter that passes data to the `onERC721Received` call for the staker
   */
  data?: Hex
}

// type guard
export function isMint(options: AddLiquidityOptions): options is MintOptions {
  return Object.keys(options).some((k) => k === 'recipient')
}

export interface CollectOptions {
  /**
   * Indicates the ID of the position to collect for.
   */
  tokenId: BigintIsh

  /**
   * Expected value of tokensOwed0, including as-of-yet-unaccounted-for fees/liquidity value to be burned
   */
  expectedCurrencyOwed0: CurrencyAmount<Currency>

  /**
   * Expected value of tokensOwed1, including as-of-yet-unaccounted-for fees/liquidity value to be burned
   */
  expectedCurrencyOwed1: CurrencyAmount<Currency>

  /**
   * The account that should receive the tokens.
   */
  recipient: Address
}

export interface NFTPermitOptions {
  v: 0 | 1 | 27 | 28
  r: `0x${string}`
  s: `0x${string}`
  deadline: BigintIsh
  spender: string
}

/**
 * Options for producing the calldata to exit a position.
 */
export interface RemoveLiquidityOptions {
  /**
   * The ID of the token to exit
   */
  tokenId: BigintIsh

  /**
   * The percentage of position liquidity to exit.
   */
  liquidityPercentage: Percent

  /**
   * How much the pool price is allowed to move.
   */
  slippageTolerance: Percent

  /**
   * When the transaction expires, in epoch seconds.
   */
  deadline: BigintIsh

  /**
   * Whether the NFT should be burned if the entire position is being exited, by default false.
   */
  burnToken?: boolean

  /**
   * The optional permit of the token ID being exited, in case the exit transaction is being sent by an account that does not own the NFT
   */
  permit?: NFTPermitOptions

  /**
   * Parameters to be passed on to collect
   */
  collectOptions: Omit<CollectOptions, 'tokenId'>
}

export abstract class NonfungiblePositionManager {
  public static ABI = nonfungiblePositionManagerABI

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line
  private constructor() {}

  private static encodeCreate(pool: Pool): Hex {
    return encodeFunctionData({
      abi: NonfungiblePositionManager.ABI,
      functionName: 'createAndInitializePoolIfNecessary',
      args: [pool.token0.address, pool.token1.address, pool.fee, pool.sqrtRatioX96],
    })
  }

  public static createCallParameters(pool: Pool): MethodParameters {
    return {
      calldata: this.encodeCreate(pool),
      value: toHex(0),
    }
  }

  public static addCallParameters(position: Position, options: AddLiquidityOptions): MethodParameters {
    invariant(position.liquidity > ZERO, 'ZERO_LIQUIDITY')

    const calldatas: Hex[] = []

    // get amounts
    const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts

    // adjust for slippage
    const minimumAmounts = position.mintAmountsWithSlippage(options.slippageTolerance)
    const amount0Min = minimumAmounts.amount0
    const amount1Min = minimumAmounts.amount1

    const deadline = BigInt(options.deadline)

    // create pool if needed
    if (isMint(options) && options.createPool) {
      calldatas.push(this.encodeCreate(position.pool))
    }

    // permits if necessary
    if (options.token0Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token0, options.token0Permit))
    }
    if (options.token1Permit) {
      calldatas.push(SelfPermit.encodePermit(position.pool.token1, options.token1Permit))
    }

    // mint
    if (isMint(options)) {
      const recipient = validateAndParseAddress(options.recipient)

      calldatas.push(
        encodeFunctionData({
          abi: NonfungiblePositionManager.ABI,
          functionName: 'mint',
          args: [
            {
              token0: position.pool.token0.address,
              token1: position.pool.token1.address,
              fee: position.pool.fee,
              tickLower: position.tickLower,
              tickUpper: position.tickUpper,
              amount0Desired,
              amount1Desired,
              amount0Min,
              amount1Min,
              recipient,
              deadline,
            },
          ],
        })
      )
    } else {
      // increase
      calldatas.push(
        encodeFunctionData({
          abi: NonfungiblePositionManager.ABI,
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
    }

    let value: Hex = toHex(0)

    if (options.useNative) {
      const { wrapped } = options.useNative
      invariant(position.pool.token0.equals(wrapped) || position.pool.token1.equals(wrapped), 'NO_WETH')

      const wrappedValue = position.pool.token0.equals(wrapped) ? amount0Desired : amount1Desired

      // we only need to refund if we're actually sending ETH
      if (wrappedValue > ZERO) {
        calldatas.push(Payments.encodeRefundETH())
      }

      value = toHex(wrappedValue)
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value,
    }
  }

  private static encodeCollect(options: CollectOptions): Hex[] {
    const calldatas: Hex[] = []

    const tokenId = BigInt(options.tokenId)

    const involvesETH =
      options.expectedCurrencyOwed0.currency.isNative || options.expectedCurrencyOwed1.currency.isNative

    const recipient = validateAndParseAddress(options.recipient)

    // collect
    calldatas.push(
      encodeFunctionData({
        abi: NonfungiblePositionManager.ABI,
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
    const calldatas: Hex[] = NonfungiblePositionManager.encodeCollect(options)

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  /**
   * Produces the calldata for completely or partially exiting a position
   * @param position The position to exit
   * @param options Additional information necessary for generating the calldata
   * @returns The call parameters
   */
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
      calldatas.push(
        encodeFunctionData({
          abi: NonfungiblePositionManager.ABI,
          functionName: 'permit',
          args: [
            validateAndParseAddress(options.permit.spender),
            tokenId,
            BigInt(options.permit.deadline),
            options.permit.v,
            options.permit.r,
            options.permit.s,
          ],
        })
      )
    }

    // remove liquidity
    calldatas.push(
      encodeFunctionData({
        abi: NonfungiblePositionManager.ABI,
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
      ...NonfungiblePositionManager.encodeCollect({
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

    if (options.liquidityPercentage.equalTo(ONE)) {
      if (options.burnToken) {
        calldatas.push(
          encodeFunctionData({ abi: NonfungiblePositionManager.ABI, functionName: 'burn', args: [tokenId] })
        )
      }
    } else {
      invariant(options.burnToken !== true, 'CANNOT_BURN')
    }

    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  public static safeTransferFromParameters(options: SafeTransferOptions): MethodParameters {
    const recipient = validateAndParseAddress(options.recipient)
    const sender = validateAndParseAddress(options.sender)

    let calldata: Hex
    if (options.data) {
      calldata = encodeFunctionData({
        abi: NonfungiblePositionManager.ABI,
        functionName: 'safeTransferFrom',
        args: [sender, recipient, BigInt(options.tokenId), options.data],
      })
    } else {
      calldata = encodeFunctionData({
        abi: NonfungiblePositionManager.ABI,
        functionName: 'safeTransferFrom',
        args: [sender, recipient, BigInt(options.tokenId)],
      })
    }
    return {
      calldata,
      value: toHex(0),
    }
  }
}
