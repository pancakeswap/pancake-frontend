import { encodeAbiParameters, keccak256, parseAbiParameters, zeroAddress } from 'viem'
import { Bytes32, PoolKey } from '../types'
import { encodePoolParameters } from './encodePoolParameters'

/**
 * `PoolId` is a bytes32 of `keccak256(abi.encode(poolKey))`
 * @see {@link PoolKey}
 * @see {@link https://github.com/pancakeswap/pancake-v4-core/blob/main/src/types/PoolId.sol|v4-core}
 * @param param0
 * @returns
 */
export const getPoolId = ({
  currency0,
  currency1,
  hooks = zeroAddress,
  poolManager,
  fee,
  parameters,
}: PoolKey): Bytes32 => {
  const poolParameter = encodePoolParameters(parameters)

  return keccak256(
    encodeAbiParameters(parseAbiParameters('address, address, address, address, uint24, bytes32'), [
      currency0,
      currency1,
      hooks,
      poolManager,
      fee,
      poolParameter,
    ])
  )
}
