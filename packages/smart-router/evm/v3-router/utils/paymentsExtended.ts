import { Interface } from '@ethersproject/abi'
import { Percent, Token, validateAndParseAddress, JSBI } from '@pancakeswap/sdk'
import { FeeOptions, Payments, toHex } from '@pancakeswap/v3-sdk'

import abi from '../../abis/IPeripheryPaymentsWithFeeExtended.json'

function encodeFeeBips(fee: Percent): string {
  return toHex(fee.multiply(10_000).quotient)
}

export abstract class PaymentsExtended {
  public static INTERFACE: Interface = new Interface(abi)

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  private constructor() {}

  public static encodeUnwrapWETH9(amountMinimum: JSBI, recipient?: string, feeOptions?: FeeOptions): string {
    // if there's a recipient, just pass it along
    if (typeof recipient === 'string') {
      return Payments.encodeUnwrapWETH9(amountMinimum, recipient, feeOptions)
    }

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return PaymentsExtended.INTERFACE.encodeFunctionData('unwrapWETH9WithFee(uint256,uint256,address)', [
        toHex(amountMinimum),
        feeBips,
        feeRecipient,
      ])
    }
    return PaymentsExtended.INTERFACE.encodeFunctionData('unwrapWETH9(uint256)', [toHex(amountMinimum)])
  }

  public static encodeSweepToken(
    token: Token,
    amountMinimum: JSBI,
    recipient?: string,
    feeOptions?: FeeOptions,
  ): string {
    // if there's a recipient, just pass it along
    if (typeof recipient === 'string') {
      return Payments.encodeSweepToken(token, amountMinimum, recipient, feeOptions)
    }

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return PaymentsExtended.INTERFACE.encodeFunctionData('sweepTokenWithFee(address,uint256,uint256,address)', [
        token.address,
        toHex(amountMinimum),
        feeBips,
        feeRecipient,
      ])
    }
    return PaymentsExtended.INTERFACE.encodeFunctionData('sweepToken(address,uint256)', [
      token.address,
      toHex(amountMinimum),
    ])
  }

  public static encodePull(token: Token, amount: JSBI): string {
    return PaymentsExtended.INTERFACE.encodeFunctionData('pull', [token.address, toHex(amount)])
  }

  public static encodeWrapETH(amount: JSBI): string {
    return PaymentsExtended.INTERFACE.encodeFunctionData('wrapETH', [toHex(amount)])
  }
}
