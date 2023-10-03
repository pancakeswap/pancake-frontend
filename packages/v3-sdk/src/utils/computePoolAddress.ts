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
import { ChainId } from '@pancakeswap/chains'
import { FeeAmount, POOL_INIT_CODE_HASHES } from '../constants'

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

const EMPTY_INPU_HASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
const ZKSYNC_PREFIX = '0x2020dba91b30cc0006188af794c2fb30dd8520db7e2c088b7fc7c103c00ca494' // keccak256('zksyncCreate2')

function getCreate2AddressZkSync(from: Address, salt: `0x${string}`, initCodeHash: `0x${string}`): `0x${string}` {
  return getAddress(
    `0x${keccak256(concat([ZKSYNC_PREFIX, pad(from, { size: 32 }), salt, initCodeHash, EMPTY_INPU_HASH])).slice(26)}`
  )
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

  const salt = keccak256(
    encodeAbiParameters(parseAbiParameters(['address, address, uint24']), [token0.address, token1.address, fee])
  )

  if (token0.chainId === ChainId.ZKSYNC || token0.chainId === ChainId.ZKSYNC_TESTNET) {
    return getCreate2AddressZkSync(
      deployerAddress,
      salt,
      initCodeHashManualOverride ?? POOL_INIT_CODE_HASHES[token0.chainId as keyof typeof POOL_INIT_CODE_HASHES]
    )
  }

  return getCreate2Address(
    deployerAddress,
    salt,
    initCodeHashManualOverride ?? POOL_INIT_CODE_HASHES[token0.chainId as keyof typeof POOL_INIT_CODE_HASHES]
  )
}
