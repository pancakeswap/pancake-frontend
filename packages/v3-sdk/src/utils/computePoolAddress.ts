import {
  keccak256,
  Address,
  encodeAbiParameters,
  parseAbiParameters,
  Hash,
  GetCreate2AddressOptions,
  Hex,
  toBytes,
  pad,
  isBytes,
  slice,
  concat,
  getAddress,
  ByteArray,
} from 'viem'
import { Token } from '@pancakeswap/sdk'
import { FeeAmount, POOL_INIT_CODE_HASH } from '../constants'

function getCreate2Address(
  from_: GetCreate2AddressOptions['from'],
  salt_: GetCreate2AddressOptions['salt'],
  initCodeHash: Hex
) {
  const from = toBytes(getAddress(from_))
  const salt = pad(isBytes(salt_) ? salt_ : toBytes(salt_ as Hex), {
    size: 32,
  }) as ByteArray

  return getAddress(slice(keccak256(concat([toBytes('0xff'), from, salt, toBytes(initCodeHash)])), 12))
}

/**
 * Computes a pool address
 * @param deployerAddress The Pancake V3 deployer address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computePoolAddress({
  deployerAddress,
  tokenA,
  tokenB,
  fee,
  initCodeHashManualOverride,
}: {
  deployerAddress: Address
  tokenA: Token
  tokenB: Token
  fee: FeeAmount
  initCodeHashManualOverride?: Hash
}): Address {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

  return getCreate2Address(
    deployerAddress,
    keccak256(
      encodeAbiParameters(parseAbiParameters(['address, address, uint24']), [token0.address, token1.address, fee])
    ),
    initCodeHashManualOverride ?? POOL_INIT_CODE_HASH
  )
}
