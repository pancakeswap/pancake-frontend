import { ChainId } from '@pancakeswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { OpUnitType } from 'dayjs'

export const v3InfoPath = `info/v3`

export const POOL_HIDE: { [key: string]: string[] } = {
  // TODO: update to our own
  [ChainId.ETHEREUM]: [
    '0x86d257cdb7bc9c0df10e84c8709697f92770b335',
    '0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee',
    '0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248',
    '0xa850478adaace4c08fc61de44d8cf3b64f359bec',
    '0x277667eb3e34f134adf870be9550e9f323d0dc24',
    '0x8c0411f2ad5470a66cb2e9c64536cfb8dcd54d51',
    '0x055284a4ca6532ecc219ac06b577d540c686669d',
  ],
  [ChainId.BSC]: [],
}

export const TOKEN_HIDE: { [key: string]: string[] } = {
  [ChainId.ETHEREUM]: [
    '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
    '0x7dfb72a2aad08c937706f21421b15bfc34cba9ca',
    '0x12b32f10a499bf40db334efe04226cca00bf2d9b',
    '0x160de4468586b6b2f8a92feb0c260fc6cfc743b1',
  ],
  [ChainId.BSC]: [],
}

export const TimeWindow: {
  [key: string]: OpUnitType
} = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
}

export const ONE_HOUR_SECONDS = 3600
export const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

export const SUBGRAPH_START_BLOCK = {
  [ChainId.BSC]: 26931960,
  [ChainId.ETHEREUM]: 16963633,
}
