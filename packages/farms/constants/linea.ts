import { lineaTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { FarmConfigV3 } from '../src'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

const v3TopFixedFarms: FarmConfigV3[] = [
  {
    pid: 9,
    lpAddress: '0x586733678b9aC9Da43dD7CB83bbB41d23677Dfc3',
    token0: lineaTokens.usdc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 12,
    lpAddress: '0x1947B87d35E9f1cd53CEDe1aD6F7be44C12212B8',
    token0: lineaTokens.usdt,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 1,
    lpAddress: '0xd5539D0360438a66661148c633A9F0965E482845',
    token0: lineaTokens.usdc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 8,
    lpAddress: '0xc014414696F332C96C471634620344143325D2C0',
    token0: lineaTokens.usdt,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },

  {
    pid: 2,
    lpAddress: '0x6a72F4F191720c411Cd1fF6A5EA8DeDEC3A64771',
    token0: lineaTokens.usdc,
    token1: lineaTokens.usdt,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 10,
    lpAddress: '0x5AFda31027C3E6A03c77a113FFC031B564AbbF05',
    token0: lineaTokens.wbtc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 3,
    lpAddress: '0xbD3bc396C9393e63bBc935786Dd120B17F58Df4c',
    token0: lineaTokens.wbtc,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
]

export const farmsV3 = defineFarmV3Configs([
  ...v3TopFixedFarms,
  {
    pid: 13,
    lpAddress: '0xfDe733b5DE5B5a06C68353e01E4c1D3415C89560',
    token0: lineaTokens.ezETH,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },

  {
    pid: 11,
    lpAddress: '0xE817A59F8A030544Ff65F47536abA272F6d63059',
    token0: lineaTokens.cake,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.HIGH,
  },

  {
    pid: 7,
    lpAddress: '0x90375306810C6E8B2efa8294835C78B499D7c691',
    token0: lineaTokens.wstETH,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 6,
    lpAddress: '0x3f63a467C54c96538bD36A7DF1b9E7C4719DcaC9',
    token0: lineaTokens.wstETH,
    token1: lineaTokens.weth,
    feeAmount: FeeAmount.LOWEST,
  },

  {
    pid: 4,
    lpAddress: '0xA48E0630B7b9dCb250112143C9D0fe47d26CB1e4',
    token0: lineaTokens.usdc,
    token1: lineaTokens.dai,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 5,
    lpAddress: '0x85164B6d8a74bA481AB6D02D2C4e779ECCBAF982',
    token0: lineaTokens.usdc,
    token1: lineaTokens.axlusdc,
    feeAmount: FeeAmount.LOWEST,
  },
])
