import { Percent, Token, validateAndParseAddress } from '@pancakeswap/sdk'
import { Address, encodeFunctionData } from 'viem'
import { peripheryPaymentsWithFeeABI } from './abi/PeripheryPaymentsWithFee'

export interface FeeOptions {
  /**
   * The percent of the output that will be taken as a fee.
   */
  fee: Percent

  /**
   * The recipient of the fee.
   */
  recipient: Address
}

export abstract class Payments {
  public static ABI = peripheryPaymentsWithFeeABI

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  private static encodeFeeBips(fee: Percent): bigint {
    return fee.multiply(10_000).quotient
  }

  public static encodeUnwrapWETH9(amountMinimum: bigint, recipient: Address, feeOptions?: FeeOptions): `0x${string}` {
    recipient = validateAndParseAddress(recipient)

    if (feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: Payments.ABI,
        functionName: 'unwrapWETH9WithFee',
        args: [amountMinimum, recipient, feeBips, feeRecipient],
      })
    }

    return encodeFunctionData({ abi: Payments.ABI, functionName: 'unwrapWETH9', args: [amountMinimum, recipient] })
  }

  public static encodeSweepToken(
    token: Token,
    amountMinimum: bigint,
    recipient: Address,
    feeOptions?: FeeOptions
  ): `0x${string}` {
    recipient = validateAndParseAddress(recipient)

    if (feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: Payments.ABI,
        functionName: 'sweepTokenWithFee',
        args: [token.address, amountMinimum, recipient, feeBips, feeRecipient],
      })
    }

    return encodeFunctionData({
      abi: Payments.ABI,
      functionName: 'sweepToken',
      args: [token.address, amountMinimum, recipient],
    })
  }

  public static encodeRefundETH(): `0x${string}` {
    return encodeFunctionData({ abi: Payments.ABI, functionName: 'refundETH' })
  }
}
