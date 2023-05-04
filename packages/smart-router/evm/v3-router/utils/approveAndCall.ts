import { Hex, encodeFunctionData, Address } from 'viem'
import invariant from 'tiny-invariant'
import { Currency, Percent, Token } from '@pancakeswap/sdk'
import { MintSpecificOptions, IncreaseSpecificOptions, NonfungiblePositionManager, Position } from '@pancakeswap/v3-sdk'

import { approveAndCallAbi } from '../../abis/IApproveAndCall'

// condensed version of v3-sdk AddLiquidityOptions containing only necessary swap + add attributes
export type CondensedAddLiquidityOptions = Omit<MintSpecificOptions, 'createPool'> | IncreaseSpecificOptions

export enum ApprovalTypes {
  NOT_REQUIRED = 0,
  MAX = 1,
  MAX_MINUS_ONE = 2,
  ZERO_THEN_MAX = 3,
  ZERO_THEN_MAX_MINUS_ONE = 4,
}

// type guard
export function isMint(options: CondensedAddLiquidityOptions): options is Omit<MintSpecificOptions, 'createPool'> {
  return Object.keys(options).some((k) => k === 'recipient')
}

export abstract class ApproveAndCall {
  public static ABI = approveAndCallAbi

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  private constructor() {}

  public static encodeApproveMax(token: Token): Hex {
    return encodeFunctionData({
      abi: ApproveAndCall.ABI,
      functionName: 'approveMax',
      args: [token.address],
    })
  }

  public static encodeApproveMaxMinusOne(token: Token): Hex {
    return encodeFunctionData({
      abi: ApproveAndCall.ABI,
      functionName: 'approveMaxMinusOne',
      args: [token.address],
    })
  }

  public static encodeApproveZeroThenMax(token: Token): Hex {
    return encodeFunctionData({
      abi: ApproveAndCall.ABI,
      functionName: 'approveZeroThenMax',
      args: [token.address],
    })
  }

  public static encodeApproveZeroThenMaxMinusOne(token: Token): Hex {
    return encodeFunctionData({
      abi: ApproveAndCall.ABI,
      functionName: 'approveZeroThenMaxMinusOne',
      args: [token.address],
    })
  }

  public static encodeCallPositionManager(calldatas: Hex[]): Hex {
    invariant(calldatas.length > 0, 'NULL_CALLDATA')

    if (calldatas.length === 1) {
      return encodeFunctionData({
        abi: ApproveAndCall.ABI,
        functionName: 'callPositionManager',
        args: calldatas as [Hex],
      })
    }
    const encodedMulticall = encodeFunctionData({
      abi: NonfungiblePositionManager.ABI,
      functionName: 'multicall',
      args: [calldatas],
    })
    return encodeFunctionData({
      abi: ApproveAndCall.ABI,
      functionName: 'callPositionManager',
      args: [encodedMulticall],
    })
  }

  /**
   * Encode adding liquidity to a position in the nft manager contract
   * @param position Forcasted position with expected amount out from swap
   * @param minimalPosition Forcasted position with custom minimal token amounts
   * @param addLiquidityOptions Options for adding liquidity
   * @param slippageTolerance Defines maximum slippage
   */
  public static encodeAddLiquidity(
    position: Position,
    minimalPosition: Position,
    addLiquidityOptions: CondensedAddLiquidityOptions,
    slippageTolerance: Percent,
  ): Hex {
    let { amount0: amount0Min, amount1: amount1Min } = position.mintAmountsWithSlippage(slippageTolerance)

    // position.mintAmountsWithSlippage() can create amounts not dependenable in scenarios
    // such as range orders. Allow the option to provide a position with custom minimum amounts
    // for these scenarios
    if (minimalPosition.amount0.quotient < amount0Min) {
      amount0Min = minimalPosition.amount0.quotient
    }
    if (minimalPosition.amount1.quotient < amount1Min) {
      amount1Min = minimalPosition.amount1.quotient
    }

    if (isMint(addLiquidityOptions)) {
      return encodeFunctionData({
        abi: ApproveAndCall.ABI,
        functionName: 'mint',
        args: [
          {
            token0: position.pool.token0.address,
            token1: position.pool.token1.address,
            fee: position.pool.fee,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            amount0Min,
            amount1Min,
            recipient: addLiquidityOptions.recipient as Address,
          },
        ],
      })
    }

    return encodeFunctionData({
      abi: ApproveAndCall.ABI,
      functionName: 'increaseLiquidity',
      args: [
        {
          token0: position.pool.token0.address,
          token1: position.pool.token1.address,
          amount0Min,
          amount1Min,
          tokenId: BigInt(addLiquidityOptions.tokenId),
        },
      ],
    })
  }

  public static encodeApprove(token: Currency, approvalType: ApprovalTypes): Hex {
    switch (approvalType) {
      case ApprovalTypes.MAX:
        return ApproveAndCall.encodeApproveMax(token.wrapped)
      case ApprovalTypes.MAX_MINUS_ONE:
        return ApproveAndCall.encodeApproveMaxMinusOne(token.wrapped)
      case ApprovalTypes.ZERO_THEN_MAX:
        return ApproveAndCall.encodeApproveZeroThenMax(token.wrapped)
      case ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE:
        return ApproveAndCall.encodeApproveZeroThenMaxMinusOne(token.wrapped)
      default:
        throw new Error('Error: invalid ApprovalType')
    }
  }
}
