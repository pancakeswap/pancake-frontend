import { ethereumTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    vaultPid: 1,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdt,
  },
  {
    pid: 2,
    vaultPid: 2,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.usdc,
  },
  {
    pid: 3,
    vaultPid: 3,
    lpSymbol: 'ETH-WBTC LP',
    lpAddress: '0x4585fe77225b41b697c938b018e2ac67ac5a20c0',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.wbtc,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
