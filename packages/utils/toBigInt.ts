import { BigintIsh } from '@pancakeswap/sdk'

export function toBigInt(num: BigintIsh): bigint {
  return BigInt(num.toString())
}
