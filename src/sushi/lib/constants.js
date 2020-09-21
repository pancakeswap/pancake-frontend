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
    97: '0xF0Ae9b39ef4A2680D67C9fb252816725f22624b0',
    56:  '0x7d813C828b0d1083Bb08b38841C45304A920060b'
    // 56: '0xbbB2aaEB8c9dA72bb7faDB42A9c84AACF26974Fd'
  },
  syrup: {
    97: '0x51f336Ba54D87f12b7459F3a4b7064f6FC7cdBf2',
    56:  '0x7d813C828b0d1083Bb08b38841C45304A920060b'
  },
  masterChef: {
    97: '0x2c67850aB6d76C36aEC82A0A0BcDF0713049c9a1',
    56: '0x7d813C828b0d1083Bb08b38841C45304A920060b', //  real cake
    // 56: '0x39447351Fe7939C064CDD9A258F22FC76233E28e'
  },
  weth: {
    97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
}

// BUSD-BNB LP
// 0x1b96b92314c44b159149f7e0303511fb2fc4774f
// BAKE-BNB LP
// 0x3da30727ed0626b78c212e81b37b97a8ef8a25bb
// BUSD-BAKE LP
// 0xe2d1b285d83efb935134f644d00fb7c943e84b5b

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      97: '0xF0Ae9b39ef4A2680D67C9fb252816725f22624b0',
      56: '0x8ff5196c821b935109c74d74b1bb508f1bf2a3d7'
    },
    tokenAddresses: {
      97: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      56: '0xbbB2aaEB8c9dA72bb7faDB42A9c84AACF26974Fd'
    },
    name: 'Cake STAKING',
    symbol: 'CAKE',
    tokenSymbol: 'CAKE',
    icon: '🥞',
  },
  {
    pid: 1,
    lpAddresses: {
      97: '0xe70b7523f4bffa1f2e88d2ba709afd026030f412',
      56: '0x8ff5196c821b935109c74d74b1bb508f1bf2a3d7'
    },
    tokenAddresses: {
      97: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      56: '0xbbB2aaEB8c9dA72bb7faDB42A9c84AACF26974Fd'
    },
    name: 'Cake STAKING',
    symbol: 'CAKE-BNB FLIP',
    tokenSymbol: 'CAKE',
    icon: '🥞',
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
  },
  {
    pid: 3,
    lpAddresses: {
      97: '0xcbe3282a562e23b8c61ed04bb72ffdbb9233b1ce',
      56: '0xe2d1b285d83efb935134f644d00fb7c943e84b5b'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    name: 'ADA GAME',
    symbol: 'ADA-BNB FLIP',
    tokenSymbol: 'ADA',
  },
  {
    pid: 4,
    lpAddresses: {
      97: '0xcbe3282a562e23b8c61ed04bb72ffdbb9233b1ce',
      56: '0xe2d1b285d83efb935134f644d00fb7c943e84b5b'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    name: 'BAND GAME',
    symbol: 'BAND-BNB FLIP',
    tokenSymbol: 'BAND',
  },
  {
    pid: 5,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xe2d1b285d83efb935134f644d00fb7c943e84b5b'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    name: 'DOT GAME',
    symbol: 'DOT-BNB FLIP',
    tokenSymbol: 'DOT',
  },
  {
    pid: 6,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xe2d1b285d83efb935134f644d00fb7c943e84b5b'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    name: 'EOS GAME',
    symbol: 'EOS-BNB FLIP',
    tokenSymbol: 'EOS',
  },
  {
    pid: 7,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xe2d1b285d83efb935134f644d00fb7c943e84b5b'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    name: 'LINK GAME',
    symbol: 'LINK-BNB FLIP',
    tokenSymbol: 'LINK',
  },
  {
    pid: 8,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x3da30727ed0626b78c212e81b37b97a8ef8a25bb'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    symbol: 'BAKE-BNB Bakery LP',
    tokenSymbol: 'BAKE',
  },
  {
    pid: 9,
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xe2d1b285d83efb935134f644d00fb7c943e84b5b'
    },
    tokenAddresses: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    },
    symbol: 'BURGER-BNB FLIP',
    tokenSymbol: 'BURGER',
  }
]

export const forShowPools = [
  {
    pid: 0,
    name: 'Cake Party!',
    symbol: 'CAKE-BNB',
    tokenSymbol: 'CAKE',
  },
  {
    pid: 1,
    name: 'BURGER GAME',
    symbol: 'BUSD-BNB',
    tokenSymbol: 'BUSD',
  },
  {
    pid: 10,
    symbol: 'ADA-BNB',
    tokenSymbol: 'ADA',
  },
  {
    pid: 7,
    symbol: 'BAND-BNB',
    tokenSymbol: 'BAND',
  },
  {
    pid: 8,
    symbol: 'DOT-BNB',
    tokenSymbol: 'DOT',
  },
  {
    pid: 6,
    symbol: 'EOS-BNB',
    tokenSymbol: 'EOS',
  },
  {
    pid: 9,
    symbol: 'LINK-BNB',
    tokenSymbol: 'LINK',
  },
  {
    pid: 3,
    symbol: 'BAKE-BNB Bakery LP',
    tokenSymbol: 'BAKE',
  },
  {
    pid: 4,
    name: 'BURGER GAME',
    symbol: 'BURGER-BNB',
    tokenSymbol: 'BURGER',
  }
]
