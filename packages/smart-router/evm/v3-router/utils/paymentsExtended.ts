import { Hex, Address, encodeFunctionData } from 'viem'
import { Percent, Token, validateAndParseAddress } from '@pancakeswap/sdk'
import { FeeOptions, Payments } from '@pancakeswap/v3-sdk'

import { peripheryPaymentsWithFeeExtendedAbi } from '../../abis/IPeripheryPaymentsWithFeeExtended'

function encodeFeeBips(fee: Percent): bigint {
  return fee.multiply(10_000).quotient
}

export abstract class PaymentsExtended {
  public static ABI = peripheryPaymentsWithFeeExtendedAbi

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  private constructor() {}

  public static encodeUnwrapWETH9(amountMinimum: bigint, recipient?: Address, feeOptions?: FeeOptions): Hex {
    // if there's a recipient, just pass it along
    if (typeof recipient === 'string') {
      return Payments.encodeUnwrapWETH9(amountMinimum, recipient, feeOptions)
    }

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: PaymentsExtended.ABI,
        functionName: 'unwrapWETH9WithFee',
        args: [amountMinimum, feeBips, feeRecipient],
      })
    }

    return encodeFunctionData({
      abi: PaymentsExtended.ABI,
      functionName: 'unwrapWETH9',
      args: [amountMinimum],
    })
  }

  public static encodeSweepToken(
    token: Token,
    amountMinimum: bigint,
    recipient?: Address,
    feeOptions?: FeeOptions,
  ): Hex {
    // if there's a recipient, just pass it along
    if (typeof recipient === 'string') {
      return Payments.encodeSweepToken(token, amountMinimum, recipient, feeOptions)
    }

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: PaymentsExtended.ABI,
        functionName: 'sweepTokenWithFee',
        args: [token.address, amountMinimum, feeBips, feeRecipient],
      })
    }

    return encodeFunctionData({
      abi: PaymentsExtended.ABI,
      functionName: 'sweepToken',
      args: [token.address, amountMinimum],
    })
  }

  public static encodePull(token: Token, amount: bigint): Hex {
    return encodeFunctionData({ abi: PaymentsExtended.ABI, functionName: 'pull', args: [token.address, amount] })
  }

  public static encodeWrapETH(amount: bigint): Hex {
    return encodeFunctionData({ abi: PaymentsExtended.ABI, functionName: 'wrapETH', args: [amount] })
  }
}
