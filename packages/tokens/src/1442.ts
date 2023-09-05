import { ChainId, ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { USDT } from './common'

export const polygonZkEvmTestnetTokens = {
  weth: WETH9[ChainId.POLYGON_ZKEVM_TESTNET],
  usdt: USDT[ChainId.POLYGON_ZKEVM_TESTNET],
  mockA: new ERC20Token(ChainId.POLYGON_ZKEVM_TESTNET, '0xa8209d33Bfc9cA15138dDaB6A637f6c4617379c9', 18, 'MOCKA'),
  mockB: new ERC20Token(ChainId.POLYGON_ZKEVM_TESTNET, '0x62d907974C0b72334373f34b8272467857402Ec3', 18, 'MOCKB'),
  mockC: new ERC20Token(ChainId.POLYGON_ZKEVM_TESTNET, '0xf317eD77Baed624d0EA2384AA88D91B774a9b009', 18, 'MOCKC'),
}
