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


export const contractAddresses = {
  sushi: {
    97: '0x43acC9A5E94905c7D31415EB410F3E666e5F1e9A',
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
  },
  weth: {
    97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
  lottery: {
    97: '0x58096cB4D9fB098448Fc8F21FF8dea6D9Ca097D6',
    56:  '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
  },
  lotteryNFT: {
    97: '0x6691Aa11326338eb6fd63b1E424Ba0B637fb05C3',
    56:  '0x009cF7bC57584b7998236eff51b98A168DceA9B0'
  },
  mulltiCall: {
    56: '0x1ee38d535d541c55c9dae27b12edf090c608e6fb',
    97: '0x67ADCB4dF3931b0C5Da724058ADC2174a9844412'
  }
}

export const sousChefTeam = [
  {
    sousId: 4,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0xD32B30b151a6aDB2e0Fa573a37510C097DaBD2F3',
    },
    tokenName: 'SXP',
    projectLink: 'https://swipe.io/',
    harvest: true,
    tokenPerBlock: "0.5"
  },
  {
    sousId: 3,
    contractAddress: {
      97: '0xAfd61Dc94f11A70Ae110dC0E0F2061Af5633061A',
      56: '0x92E8CeB7eAeD69fB6E4d9dA43F605D2610214E68',
    },
    tokenName: 'INJ',
    projectLink: 'https://injectiveprotocol.com/',
    harvest: true,
    tokenPerBlock: "0.25"
  },
  {
    sousId: 1,
    contractAddress: {
      97: '0xAfd61Dc94f11A70Ae110dC0E0F2061Af5633061A',
      56: '0xAfd61Dc94f11A70Ae110dC0E0F2061Af5633061A',
    },
    tokenName: 'TWT',
    projectLink: 'https://trustwallet.com/',
    harvest: true,
    tokenPerBlock: "20"
  },
  {
    sousId: 2,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0x73c83bd1646991cBca3e6b83ca905542FE07C57A',
    },
    tokenName: 'ALPHA',
    projectLink: 'https://alphafinance.io/',
    harvest: true,
    tokenPerBlock: "20"
  },
  {
    sousId: 0,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0x6ab8463a4185b80905e05a9ff80a2d6b714b9e95',
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
    multiplier: '8X'
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
    multiplier: '3X'
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
    multiplier: '3X'
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
    multiplier: '3X'
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
    multiplier: '3X'
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
    multiplier: '3X'
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
    pid: 13,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x41182c32F854dd97bA0e0B1816022e0aCB2fc0bb'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63'
    },
    symbol: 'XVS-BNB FLP',
    tokenSymbol: 'XVS',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 14,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x70D8929d04b60Af4fb9B58713eBcf18765aDE422'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
    },
    symbol: 'ETH-BNB FLP',
    tokenSymbol: 'ETH',
    icon: '🥞',
    multiplier: '2X'
  },
  {
    pid: 15,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x7561EEe90e24F3b348E1087A005F78B4c8453524'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'
    },
    symbol: 'BTCB-BNB FLP',
    tokenSymbol: 'BTC',
    icon: '🥞',
    multiplier: '2X'
  },
  {
    pid: 16,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x4e0f3385d932F7179DeE045369286FFa6B03d887'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xa1faa113cbe53436df28ff0aee54275c13b40975'
    },
    symbol: 'ALPHA-BNB FLP',
    tokenSymbol: 'ALPHA',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 17,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x20bcc3b8a0091ddac2d0bc30f68e6cbb97de59cd'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x55d398326f99059ff775485246999027b3197955'
    },
    symbol: 'USDT-BNB FLP',
    tokenSymbol: 'USDT',
    icon: '🥞',
    multiplier: '2X'
  },
  {
    pid: 18,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xc7b4b32a3be2cb6572a1c9959401f832ce47a6d2'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe'
    },
    symbol: 'XRP-BNB FLP',
    tokenSymbol: 'XRP',
    icon: '🥞',
    multiplier: '2X'
  },
  {
    pid: 19,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x2333c77fc0b2875c11409cdcd3c75d42d402e834'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x0eb3a705fc54725037cc9e008bdede697f62f335'
    },
    symbol: 'ATOM-BNB FLP',
    tokenSymbol: 'ATOM',
    icon: '🥞',
    multiplier: '2X'
  },
  {
    pid: 20,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x574a978c2d0d36d707a05e459466c7a1054f1210'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x7f70642d88cf1c4a3a7abb072b53b929b653eda5'
    },
    symbol: 'YFII-BNB FLP',
    tokenSymbol: 'YFII',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 21,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x56c77d59e82f33c712f919d09fceddf49660a829'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3'
    },
    symbol: 'DAI-BNB FLP',
    tokenSymbol: 'DAI',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 22,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x5acac332f0f49c8badc7afd0134ad19d3db972e6'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x16939ef78684453bfdfb47825f8a5f714f12623a'
    },
    symbol: 'XTZ-BNB FLP',
    tokenSymbol: 'XTZ',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 23,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x54edd846db17f43b6e43296134ecd96284671e81'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x8ff795a6f4d97e7887c79bea79aba5cc76444adf'
    },
    symbol: 'BCH-BNB FLP',
    tokenSymbol: 'BCH',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 24,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x68Ff2ca47D27db5Ac0b5c46587645835dD51D3C1'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e'
    },
    symbol: 'YFI-BNB FLIP',
    tokenSymbol: 'YFI',
    icon: '🥞',
    multiplier: '2X'
  },
  {
    pid: 25,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x4269e7F43A63CEA1aD7707Be565a94a9189967E9'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1'
    },
    symbol: 'UNI-BNB FLIP',
    tokenSymbol: 'UNI',
    icon: '🥞',
    multiplier: '2X'
  },
  {
    pid: 26,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x35fe9787f0ebf2a200bac413d3030cf62d312774'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153'
    },
    symbol: 'FIL-BNB FLIP',
    tokenSymbol: 'FIL',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 27,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x7a34bd64d18e44CfdE3ef4B81b87BAf3EB3315B6'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xa2b726b1145a4773f68593cf171187d8ebe4d495'
    },
    symbol: 'INJ-BNB FLIP',
    tokenSymbol: 'INJ',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 29,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x30479874f9320a62bce3bc0e315c920e1d73e278'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
    },
    symbol: 'USDC-BNB FLIP',
    tokenSymbol: 'USDC',
    icon: '🥞',
    multiplier: '1X'
  },
  {
    pid: 30,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x752E713fB70E3FA1Ac08bCF34485F14A986956c4'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a'
    },
    symbol: 'SXP-BNB FLIP',
    tokenSymbol: 'SXP',
    icon: '🥞',
    multiplier: '2X'
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
    multiplier: '0X'
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
    multiplier: '0X'
  },
]

export const forShowPools = [
  {
    pid: 0,
    symbol: 'CAKE-BNB',
    tokenSymbol: 'CAKE',
    multiplier: '20X'
  },
  {
    pid: 1,
    symbol: 'BUSD-BNB',
    tokenSymbol: 'BUSD',
    multiplier: '8X'
  },
  {
    pid: 10,
    symbol: 'ADA-BNB',
    tokenSymbol: 'ADA',
    multiplier: '3X'
  },
  {
    pid: 7,
    symbol: 'BAND-BNB',
    tokenSymbol: 'BAND',
    multiplier: '3X'
  },
  {
    pid: 8,
    symbol: 'DOT-BNB',
    tokenSymbol: 'DOT',
    multiplier: '3X'
  },
  {
    pid: 6,
    symbol: 'EOS-BNB',
    tokenSymbol: 'EOS',
    multiplier: '3X'
  },
  {
    pid: 9,
    symbol: 'LINK-BNB',
    tokenSymbol: 'LINK',
    multiplier: '3X'
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
  },
  {
    pid: 13,
    symbol: 'XVS-BNB',
    tokenSymbol: 'XVS',
    multiplier: '1X'
  },
  {
    pid: 14,
    symbol: 'ETH-BNB',
    tokenSymbol: 'ETH',
    multiplier: '2X'
  },
  {
    pid: 15,
    symbol: 'BTCB-BNB',
    tokenSymbol: 'BTC',
    multiplier: '2X'
  },
  {
    pid: 16,
    symbol: 'ALPHA-BNB',
    tokenSymbol: 'ALPHA',
    multiplier: '1X'
  },
  {
    pid: 17,
    symbol: 'USDT-BNB',
    tokenSymbol: 'USDT',
    multiplier: '2X'
  },
  {
    pid: 18,
    symbol: 'XRP-BNB',
    tokenSymbol: 'XRP',
    multiplier: '2X'
  },
  {
    pid: 19,
    symbol: 'ATOM-BNB',
    tokenSymbol: 'ATOM',
    multiplier: '2X'
  },
  {
    pid: 20,
    symbol: 'YFII-BNB',
    tokenSymbol: 'YFII',
    multiplier: '1X'
  },
  {
    pid: 21,
    symbol: 'DAI-BNB',
    tokenSymbol: 'DAI',
    multiplier: '1X'
  },
  {
    pid: 22,
    symbol: 'XTZ-BNB',
    tokenSymbol: 'XTZ',
    multiplier: '1X'
  },
  {
    pid: 23,
    symbol: 'BCH-BNB',
    tokenSymbol: 'BCH',
    multiplier: '1X'
  },
  {
    pid: 24,
    symbol: 'YFI-BNB',
    tokenSymbol: 'YFI',
    multiplier: '2X'
  },
  {
    pid: 25,
    symbol: 'UNI-BNB',
    tokenSymbol: 'UNI',
    multiplier: '2X'
  },
  {
    pid: 26,
    symbol: 'FIL-BNB',
    tokenSymbol: 'FIL',
    multiplier: '1X'
  },
  {
    pid: 27,
    symbol: 'INJ-BNB',
    tokenSymbol: 'INJ',
    multiplier: '1X'
  },
  {
    pid: 29,
    symbol: 'USDC-BNB',
    tokenSymbol: 'USDC',
    multiplier: '1X'
  },
  {
    pid: 30,
    symbol: 'SXP-BNB',
    tokenSymbol: 'SXP',
    multiplier: '2X'
  }
]

export const BLOCKS_PER_YEAR = new BigNumber(10512000)