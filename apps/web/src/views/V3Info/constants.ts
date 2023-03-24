import { ChainId } from '@pancakeswap/sdk'

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
