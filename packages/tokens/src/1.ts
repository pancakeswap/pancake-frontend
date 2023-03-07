import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'
import { USDC, USDT, WBTC_ETH } from '@pancakeswap/tokens'

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM],
  wbtc: WBTC_ETH,
  sdao: new ERC20Token(
    ChainId.ETHEREUM,
    '0x993864E43Caa7F7F12953AD6fEb1d1Ca635B875F',
    18,
    'SDAO',
    'Singularity Dao',
    'https://www.singularitydao.ai/',
  ),
  stg: new ERC20Token(
    ChainId.ETHEREUM,
    '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6',
    18,
    'STG',
    'StargateToken',
    'https://stargate.finance/',
  ),
  fuse: new ERC20Token(
    ChainId.ETHEREUM,
    '0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d',
    18,
    'FUSE',
    'Fuse Token',
    'https://fuse.io/',
  ),
}
