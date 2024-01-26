import { opBnbTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 3,
    lpAddress: '0xFf00F4E09820dbbe8582F771800732DaE7F002bD',
    token0: opBnbTokens.wbnb,
    token1: opBnbTokens.eth,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 2,
    lpAddress: '0xD9004241D34392e9Ae0C84d5aCDF76941a27D8D1',
    token0: opBnbTokens.fdusd,
    token1: opBnbTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 1,
    lpAddress: '0xc4f981189558682F15F60513158B699354B30204',
    token0: opBnbTokens.wbnb,
    token1: opBnbTokens.usdt,
    feeAmount: FeeAmount.LOW,
  },
])
