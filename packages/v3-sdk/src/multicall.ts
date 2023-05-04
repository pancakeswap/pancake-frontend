import { encodeFunctionData } from 'viem'

const IMulticall = [
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export abstract class Multicall {
  public static ABI = IMulticall

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodeMulticall(calldatas: `0x${string}` | `0x${string}`[]): `0x${string}` {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas]
    }

    return calldatas.length === 1
      ? calldatas[0]
      : encodeFunctionData({ abi: Multicall.ABI, functionName: 'multicall', args: [calldatas] })
  }
}
