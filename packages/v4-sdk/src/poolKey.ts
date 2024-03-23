import { Address, encodeAbiParameters, keccak256, parseAbiParameters, zeroAddress } from 'viem'
import { Bytes32 } from './types'
import { BinPoolParameter, CLPoolParameter, encodePoolParameters } from './utils/encodePoolParameters'

export type PoolType = 'CL' | 'Bin'

export type PoolKey<T extends PoolType = never> = {
  currency0: Address
  currency1: Address
  hooks?: Address
  poolManger: Address
  fee: number
  parameters: T extends 'CL' ? CLPoolParameter : T extends 'Bin' ? BinPoolParameter : CLPoolParameter | BinPoolParameter
}

export const toId = ({ currency0, currency1, hooks = zeroAddress, poolManger, fee, parameters }: PoolKey): Bytes32 => {
  const poolParameter = encodePoolParameters(parameters)

  return keccak256(
    encodeAbiParameters(parseAbiParameters('address, address, address, address, uint24, bytes32'), [
      currency0,
      currency1,
      hooks,
      poolManger,
      fee,
      poolParameter,
    ])
  )
}
