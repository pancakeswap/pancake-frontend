import { encodeAbiParameters, keccak256, parseAbiParameters, zeroAddress } from 'viem'
import { Bytes32 } from '../types'
import { encodePoolParameters } from './encodePoolParameters'
import { PoolKey } from './poolKey'

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
