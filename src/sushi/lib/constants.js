import BigNumber from 'bignumber.js/bignumber'

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const addressMap = {
  uniswapFactory: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
  uniswapFactoryV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
}

export const contractAddresses = {
  sushi: {
    97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
    56:  '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    // 56: '0xbbB2aaEB8c9dA72bb7faDB42A9c84AACF26974Fd'
  },
  syrup: {
    97: '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    56:  '0x009cF7bC57584b7998236eff51b98A168DceA9B0'
  },
  masterChef: {
    97: '0x1d32c2945C8FDCBc7156c553B7cEa4325a17f4f9',
    56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E', //  real cake
    // 56: '0x39447351Fe7939C064CDD9A258F22FC76233E28e'
  },
  sousChef: {
    97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
    56: '0x6ab8463a4185b80905e05a9ff80a2d6b714b9e95', //  real cake
    // 56: '0x39447351Fe7939C064CDD9A258F22FC76233E28e'
  },
  weth: {
    97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
}

export const sousChefTeam = [
  {
    sousId: 1,
    contractAddress: {
      97: '0xAfd61Dc94f11A70Ae110dC0E0F2061Af5633061A',
      56: '0xAfd61Dc94f11A70Ae110dC0E0F2061Af5633061A', //  real cake
    },
    tokenName: 'TWT',
    projectLink: 'https://trustwallet.com/',
    harvest: true
  },
  {
    sousId: 0,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0x6ab8463a4185b80905e05a9ff80a2d6b714b9e95', //  real cake
    },
    tokenName: 'XVS',
    projectLink: 'https://venus.io/',
  },
]

// BUSD-BNB LP
// 0x1b96b92314c44b159149f7e0303511fb2fc4774f
// BAKE-BNB LP
// 0x3da30727ed0626b78c212e81b37b97a8ef8a25bb
// BUSD-BAKE LP
// 0xe2d1b285d83efb935134f644d00fb7c943e84b5b

// 56 MAINNET
export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    },
    tokenAddresses: {
      97: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    },
    name: 'Cake STAKING',
    symbol: 'CAKE',
    tokenSymbol: 'SYRUP',
    icon: '🥞'
  },
  {
    pid: 1,
    lpAddresses: {
      97: '0xe70b7523f4bffa1f2e88d2ba709afd026030f412',
      56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6'
    },
    tokenAddresses: {
      97: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    },
    name: 'Cake STAKING',
    symbol: 'CAKE-BNB FLIP',
    tokenSymbol: 'CAKE',
    icon: '🥞',
    multiplier: '20X'
  },
  {
    pid: 2,
    lpAddresses: {
      97: '0x2f7682b64b88149ba3250aee32db712964de5fa9',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f'
    },
    tokenAddresses: {
      97: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    },
    name: 'Cake Party!',
    symbol: 'BUSD-BNB FLIP',
    tokenSymbol: 'BUSD',
    icon: '🥞',
    multiplier: '10X'
  },
  {
    pid: 3,
    lpAddresses: {
      97: '0xcbe3282a562e23b8c61ed04bb72ffdbb9233b1ce',
      56: '0xba51d1ab95756ca4eab8737ecd450cd8f05384cf'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47'
    },
    name: 'ADA GAME',
    symbol: 'ADA-BNB FLIP',
    tokenSymbol: 'ADA',
    icon: '🥞',
    multiplier: '5X'
  },
  {
    pid: 4,
    lpAddresses: {
      97: '0xcbe3282a562e23b8c61ed04bb72ffdbb9233b1ce',
      56: '0xc639187ef82271d8f517de6feae4faf5b517533c'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18'
    },
    name: 'BAND GAME',
    symbol: 'BAND-BNB FLIP',
    tokenSymbol: 'BAND',
    icon: '🥞',
    multiplier: '5X'
  },
  {
    pid: 5,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xbcd62661a6b1ded703585d3af7d7649ef4dcdb5c'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402'
    },
    name: 'DOT GAME',
    symbol: 'DOT-BNB FLIP',
    tokenSymbol: 'DOT',
    icon: '🥞',
    multiplier: '5X'
  },
  {
    pid: 6,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x981d2ba1b298888408d342c39c2ab92e8991691e'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x56b6fb708fc5732dec1afc8d8556423a2edccbd6'
    },
    name: 'EOS GAME',
    symbol: 'EOS-BNB FLIP',
    tokenSymbol: 'EOS',
    icon: '🥞',
    multiplier: '5X'
  },
  {
    pid: 7,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xaebe45e3a03b734c68e5557ae04bfc76917b4686'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd'
    },
    name: 'LINK GAME',
    symbol: 'LINK-BNB FLIP',
    tokenSymbol: 'LINK',
    icon: '🥞',
    multiplier: '5X'
  },
  {
    pid: 9,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xd937FB9E6e47F3805981453BFB277a49FFfE04D7'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xae9269f27437f0fcbc232d39ec814844a51d6b8f'
    },
    symbol: 'BURGER-BNB FLIP',
    tokenSymbol: 'BURGER',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 10,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x3Da30727ed0626b78C212e81B37B97A8eF8A25bB'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    symbol: 'BAKE-BNB FLIP',
    tokenSymbol: 'BAKE',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 11,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xc15fa3E22c912A276550F3E5FE3b0Deb87B55aCd'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x55d398326f99059ff775485246999027b3197955'
    },
    symbol: 'USDT-BUSD FLIP',
    tokenSymbol: 'USDT',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 12,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x610e7a287c27dfFcaC0F0a94f547Cc1B770cF483'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x4b0f1812e5df2a09796481ff14017e6005508003'
    },
    symbol: 'TWT-BNB FLP',
    tokenSymbol: 'TWT',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 8,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xc2eed0f5a0dc28cfa895084bc0a9b8b8279ae492'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    symbol: 'BAKE-BNB Bakery LP',
    tokenSymbol: 'BAKE',
    icon: '🥞',
    multiplier: '0X'
  },
]

export const forShowPools = [
  {
    pid: 0,
    name: 'Cake Party!',
    symbol: 'CAKE-BNB',
    tokenSymbol: 'CAKE',
    multiplier: '20X'
  },
  {
    pid: 1,
    name: 'BURGER GAME',
    symbol: 'BUSD-BNB',
    tokenSymbol: 'BUSD',
    multiplier: '10X'
  },
  {
    pid: 10,
    symbol: 'ADA-BNB',
    tokenSymbol: 'ADA',
    multiplier: '5X'
  },
  {
    pid: 7,
    symbol: 'BAND-BNB',
    tokenSymbol: 'BAND',
    multiplier: '5X'
  },
  {
    pid: 8,
    symbol: 'DOT-BNB',
    tokenSymbol: 'DOT',
    multiplier: '5X'
  },
  {
    pid: 6,
    symbol: 'EOS-BNB',
    tokenSymbol: 'EOS',
    multiplier: '5X'
  },
  {
    pid: 9,
    symbol: 'LINK-BNB',
    tokenSymbol: 'LINK',
    multiplier: '5X'
  },
  {
    pid: 4,
    symbol: 'BURGER-BNB',
    tokenSymbol: 'BURGER',
    multiplier: '1X'
  },
  {
    pid: 10,
    symbol: 'BAKE-BNB',
    tokenSymbol: 'BAKE',
    multiplier: '1X'
  },
  {
    pid: 11,
    symbol: 'USDT-BUSD',
    tokenSymbol: 'USDT',
    multiplier: '1X'
  },
  {
    pid: 12,
    symbol: 'TWT-BNB',
    tokenSymbol: 'TWT',
    multiplier: '1X'
  }
]
