import { WETH9, ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, USDT, CAKE } from './common'

export const zksyncTokens = {
  weth: WETH9[ChainId.ZKSYNC],
  usdc: USDC[ChainId.ZKSYNC],
  usdt: USDT[ChainId.ZKSYNC],
  cake: CAKE[ChainId.ZKSYNC],
  tes: new ERC20Token(
    ChainId.ZKSYNC,
    '0xCab3F741Fa54e79E34753B95717b23018332b8AC',
    18,
    'TES',
    'Tiny Era Shard',
    'https://tinyworlds.io/',
  ),
  wbtc: new ERC20Token(ChainId.ZKSYNC, '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011', 8, 'WBTC', 'Wrapped BTC'),
  busd: new ERC20Token(
    ChainId.ZKSYNC,
    '0x2039bb4116B4EFc145Ec4f0e2eA75012D6C0f181',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  reth: new ERC20Token(
    ChainId.ZKSYNC,
    '0x32Fd44bB869620C0EF993754c8a00Be67C464806',
    18,
    'rETH',
    'Rocket Pool ETH',
    'https://www.paxos.com/busd/',
  ),
  usdPlus: new ERC20Token(
    ChainId.ZKSYNC,
    '0x8E86e46278518EFc1C5CEd245cBA2C7e3ef11557',
    6,
    'USD+',
    'USD Plus',
    'http://usdplus.co',
  ),
}
