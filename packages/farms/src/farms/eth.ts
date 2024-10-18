import { ethereumTokens } from '@pancakeswap/tokens'
import { getAddress } from 'viem'
import { SerializedFarmConfig } from '../types'

/** @deprecated */
export const legacyFarmConfig: SerializedFarmConfig[] = [
  {
    pid: 154,
    vaultPid: 7,
    lpSymbol: 'CAPS-ETH LP',
    lpAddress: '0x829e9CC8D05d0D55B4494Ecb5a43D71546dd4DDb',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.caps,
  },
  {
    pid: 145,
    vaultPid: 6,
    lpSymbol: 'FUSE-ETH LP',
    lpAddress: '0xF9b026786522251c08d8C49e154d036Ef3Ad8Cc7',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.fuse,
  },
  {
    pid: 143,
    vaultPid: 5,
    lpSymbol: 'STG-USDC LP',
    lpAddress: '0x6cCA86CC27EB8c7C2d10B0672FE392CFC88e62ff',
    quoteToken: ethereumTokens.usdc,
    token: ethereumTokens.stg,
  },
  {
    pid: 141,
    vaultPid: 4,
    lpSymbol: 'SDAO-ETH LP',
    lpAddress: '0xDA7cF6a0CD5d5e8D10AB55d8bA58257813a239cA',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.sdao,
  },
  {
    pid: 126,
    vaultPid: 3,
    lpSymbol: 'WBTC-ETH LP',
    lpAddress: '0x4AB6702B3Ed3877e9b1f203f90cbEF13d663B0e8',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.wbtc,
  },
  {
    pid: 125,
    vaultPid: 2,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0x17C1Ae82D99379240059940093762c5e4539aba5',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdt,
  },
  {
    pid: 124,
    vaultPid: 1,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0x2E8135bE71230c6B1B4045696d41C09Db0414226',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdc,
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: getAddress(p.lpAddress),
}))
