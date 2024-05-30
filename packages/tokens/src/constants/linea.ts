import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { CAKE, USDC, USDT } from './common'

export const lineaTokens = {
  weth: WETH9[ChainId.LINEA],
  usdc: USDC[ChainId.LINEA],
  wbtc: new ERC20Token(
    ChainId.LINEA,
    '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4',
    8,
    'WBTC',
    'Wrapped BTC',
    'https://bitcoin.org/',
  ),
  usdt: USDT[ChainId.LINEA],
  dai: new ERC20Token(
    ChainId.LINEA,
    '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5',
    18,
    'DAI',
    'Dai Stablecoin',
    'https://www.makerdao.com/',
  ),
  cake: CAKE[ChainId.LINEA],
  axlusdc: new ERC20Token(
    ChainId.LINEA,
    '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    6,
    'axlUSDC',
    'Axelar Wrapped USDC',
    'https://axelarscan.io/assets/',
  ),
  wstETH: new ERC20Token(
    ChainId.LINEA,
    '0xB5beDd42000b71FddE22D3eE8a79Bd49A568fC8F',
    18,
    'wstETH',
    'Wrapped liquid staked Ether 2.0',
    'https://lido.fi/',
  ),
  ezETH: new ERC20Token(
    ChainId.LINEA,
    '0x2416092f143378750bb29b79eD961ab195CcEea5',
    18,
    'ezETH',
    'Renzo Restaked ETH',
    'https://www.renzoprotocol.com/',
  ),
  foxy: new ERC20Token(
    ChainId.LINEA,
    '0x5FBDF89403270a1846F5ae7D113A989F850d1566',
    18,
    'FOXY',
    'Foxy',
    'https://www.welikethefox.io/ ',
  ),
  onepunch: new ERC20Token(
    ChainId.LINEA,
    '0x1F63D0EC7193964142ef6B13d901462d0E5CbB50',
    18,
    'ONEPUNCH',
    'ONEPUNCH',
    'https://heroglyphs.com/',
  ),
}
