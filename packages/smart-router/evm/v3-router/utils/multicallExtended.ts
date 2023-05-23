import { encodeFunctionData, Hex } from 'viem'
import { BigintIsh } from '@pancakeswap/sdk'
import { Multicall } from '@pancakeswap/v3-sdk'

import { multicallExtendedAbi } from '../../abis/IMulticallExtended'

// deadline or previousBlockhash
export type Validation = BigintIsh | string

function validateAndParseBytes32(bytes32: string): `0x${string}` {
  if (!bytes32.match(/^0x[0-9a-fA-F]{64}$/)) {
    throw new Error(`${bytes32} is not valid bytes32.`)
  }

  return bytes32.toLowerCase() as `0x${string}`
}

export abstract class MulticallExtended {
  public static ABI = multicallExtendedAbi

  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  private constructor() {}

  public static encodeMulticall(calldatas: Hex | Hex[], validation?: Validation): Hex {
    // if there's no validation, we can just fall back to regular multicall
    if (typeof validation === 'undefined') {
      return Multicall.encodeMulticall(calldatas)
    }

    // if there is validation, we have to normalize calldatas
    if (!Array.isArray(calldatas)) {
      // eslint-disable-next-line no-param-reassign
      calldatas = [calldatas]
    }

    // this means the validation value should be a previousBlockhash
    if (typeof validation === 'string' && validation.startsWith('0x')) {
      const previousBlockhash = validateAndParseBytes32(validation)
      return encodeFunctionData({
        abi: MulticallExtended.ABI,
        functionName: 'multicall',
        args: [previousBlockhash, calldatas],
      })
    }
    const deadline = BigInt(validation)
    return encodeFunctionData({
      abi: MulticallExtended.ABI,
      functionName: 'multicall',
      args: [deadline, calldatas],
    })
  }
}
