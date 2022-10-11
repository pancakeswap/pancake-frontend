import { ethereumTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 124,
    vaultPid: 1,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0x2E8135bE71230c6B1B4045696d41C09Db0414226',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdc,
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
    pid: 126,
    vaultPid: 3,
    lpSymbol: 'WBTC-ETH LP',
    lpAddress: '0x4AB6702B3Ed3877e9b1f203f90cbEF13d663B0e8',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.wbtc,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
