import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { CAKE, USDC, USDT } from './common'

export const arbitrumTokens = {
  weth: WETH9[ChainId.ARBITRUM_ONE],
  usdt: USDT[ChainId.ARBITRUM_ONE],
  usdc: USDC[ChainId.ARBITRUM_ONE],
  cake: CAKE[ChainId.ARBITRUM_ONE],
  arb: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x912CE59144191C1204E64559FE8253a0e49E6548',
    18,
    'ARB',
    'Arbitrum',
    'https://arbitrum.io/',
  ),
  gmx: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    18,
    'GMX',
    'GMX',
    'https://gmx.io/#/',
  ),
  wbtc: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    8,
    'WBTC',
    'Wrapped BTC',
    'https://bitcoin.org/',
  ),
  alp: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xBc76B3FD0D18C7496C0B04aeA0Fe7C3Ed0e4d9C9',
    18,
    'ALP',
    'ApolloX LP',
    'https://www.apollox.finance/en',
  ),
  lvl: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xB64E280e9D1B5DbEc4AcceDb2257A87b400DB149',
    18,
    'LVL',
    'Level Token',
    'https://level.finance/',
  ),
  mgp: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xa61F74247455A40b01b0559ff6274441FAfa22A3',
    18,
    'MGP',
    'Magpie Token',
    'https://www.magpiexyz.io/',
  ),
  dai: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    18,
    'DAI',
    'Dai Stablecoin',
    'https://www.makerdao.com/',
  ),
  axlUSDC: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    6,
    'axlUSDC',
    'Axelar Wrapped USDC',
    'https://axelarscan.io/assets/',
  ),
  stg: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x6694340fc020c5E6B96567843da2df01b2CE1eb6',
    18,
    'STG',
    'StargateToken',
    'https://stargate.finance/',
  ),
  pendle: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
    18,
    'PENDLE',
    'Pendle',
    'https://www.pendle.finance/',
  ),
  mpendle: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xB688BA096b7Bb75d7841e47163Cd12D18B36A5bF',
    18,
    'mPENDLE',
    'mPendle',
    'https://www.pendle.magpiexyz.io/stake',
  ),
  rdnt: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x3082CC23568eA640225c2467653dB90e9250AaA0',
    18,
    'RDNT',
    'Radiant',
    'https://radiant.capital/',
  ),
  magic: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
    18,
    'MAGIC',
    'MAGIC',
    'https://treasure.lol/',
  ),
  wstETH: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x5979D7b546E38E414F7E9822514be443A4800529',
    18,
    'wstETH',
    'Wrapped liquid staked Ether 2.0',
    'https://lido.fi/',
  ),
  rETH: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
    18,
    'rETH',
    'Rocket Pool ETH',
    'https://rocketpool.net/',
  ),
  link: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    18,
    'LINK',
    'ChainLink Token',
    'https://chain.link/',
  ),
  stEUR: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x004626A008B1aCdC4c74ab51644093b155e59A23',
    18,
    'stEUR',
    'Staked agEUR',
    'https://www.angle.money/',
  ),
  kuji: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x3A18dcC9745eDcD1Ef33ecB93b0b6eBA5671e7Ca',
    6,
    'KUJI',
    'Kujira native asset',
    'https://kujira.network/',
  ),
  dmt: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x8B0E6f19Ee57089F7649A455D89D7bC6314D04e8',
    18,
    'DMT',
    'DMT',
    'https://sankodreammachine.net/',
  ),
  eqb: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xBfbCFe8873fE28Dfa25f1099282b088D52bbAD9C',
    18,
    'EQB',
    'Equilibria Token',
    'https://equilibria.fi/home',
  ),
  grai: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x894134a25a5faC1c2C26F1d8fBf05111a3CB9487',
    18,
    'GRAI',
    'Gravita Debt Token',
    'https://www.gravitaprotocol.com/',
  ),
  swETH: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xbc011A12Da28e8F0f528d9eE5E7039E22F91cf18',
    18,
    'swETH',
    'swETH',
    'https://www.swellnetwork.io/',
  ),
  xai: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x4Cb9a7AE498CEDcBb5EAe9f25736aE7d428C9D66',
    18,
    'XAI',
    'Xai',
    'https://xai.games/',
  ),
  usdplus: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    6,
    'USD+',
    'USD+',
    'https://overnight.fi/',
  ),
  usdce: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    6,
    'USDC.e',
    'USD Coin (Arb1)',
    'https://www.centre.io/',
  ),
  usdtplus: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xb1084db8D3C05CEbd5FA9335dF95EE4b8a0edc30',
    6,
    'USDT+',
    'USDT+',
    'https://overnight.fi/',
  ),
  ethplus: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xD4939D69B31fbE981ed6904A3aF43Ee1dc777Aab',
    18,
    'ETH+',
    'ETH+',
    'https://www.swellnetwork.io/',
  ),
  ovn: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xA3d1a8DEB97B111454B294E2324EfAD13a9d8396',
    18,
    'OVN',
    'OVN',
    'https://overnight.fi/',
  ),
  wbnb: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xa9004A5421372E1D83fB1f85b0fc986c912f91f3',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.bnbchain.org/en',
  ),
  usdv: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x323665443CEf804A3b5206103304BD4872EA4253',
    6,
    'USDV',
    'USDV',
    'https://usdv.money/',
  ),
  dlp: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x32dF62dc3aEd2cD6224193052Ce665DC18165841',
    18,
    'DLP',
    'RDNT-WETH',
    'https://pancakeswap.finance',
  ),
  mdlp: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xfe14F790DA92971131544d915c4ADa6F1abce3Bd',
    18,
    'mDLP',
    'Magpie locked DLP',
    'https://www.radiant.magpiexyz.io/stake',
  ),
  rsETH: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x4186BFC76E2E237523CBC30FD220FE055156b41F',
    18,
    'rsETH',
    'KelpDao Restaked ETH',
    'https://kelpdao.xyz/',
  ),
  ethX: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xED65C5085a18Fa160Af0313E60dcc7905E944Dc7',
    18,
    'ETHx',
    'ETHx',
    'https://www.staderlabs.com/eth/',
  ),
  ezETH: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x2416092f143378750bb29b79eD961ab195CcEea5',
    18,
    'ezETH',
    'Renzo Restaked ETH',
    'https://www.renzoprotocol.com/',
  ),
  weETH: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
    18,
    'weETH',
    'Wrapped eETH',
    'https://www.ether.fi/',
  ),
  fly: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x000F1720A263f96532D1ac2bb9CDC12b72C6f386',
    6,
    'FLY',
    'Fluidity',
    'https://fluidity.money/',
  ),
  tia: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xD56734d7f9979dD94FAE3d67C7e928234e71cD4C',
    6,
    'TIA.n',
    'TIA',
    ' https://celestia.org/',
  ),
  woo: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xcAFcD85D8ca7Ad1e1C6F82F651fA15E33AEfD07b',
    18,
    'WOO',
    'Wootrade Network',
    'https://woo.org/',
  ),
  mim: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A',
    18,
    'MIM',
    'Magic Internet Money',
    'https://abracadabra.money/',
  ),
  fusdc: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x4CFA50B7Ce747e2D61724fcAc57f24B748FF2b2A',
    6,
    'FUSDC',
    'Fluid USDC',
    'https://fluidity.money/',
  ),
  zro: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x6985884C4392D348587B19cb9eAAf157F13271cd',
    18,
    'ZRO',
    'LayerZero',
    'https://www.layerzero.foundation/',
  ),
}
