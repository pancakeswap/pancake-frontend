import { getFarmsPrices, FarmWithPrices } from './farmPrices'

describe('getFarmPrices tests', () => {
  it('Should return farm with prices', async () => {
    const farms = [
      {
        pid: 251,
        lpAddress: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
        token: {
          chainId: 56,
          address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
          symbol: 'Cake',
          name: 'PancakeSwap Token',
          decimals: 18,
        },
        quoteToken: {
          chainId: 56,
          address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
          symbol: 'WBNB',
          name: 'Wrapped BNB',
          decimals: 18,
        },
        lpSymbol: 'Cake-BNB LP',
        tokenAmountTotal: '21398955.65471099848053452',
        quoteTokenAmountTotal: '303254.751655462107052393',
        lpTotalSupply: '2411378689295081937737335.0',
        lpTotalInQuoteToken: '574199.933165486327485594',
        tokenPriceVsQuote: '0.014171474372334628',
        poolWeight: '0.446927374301675977',
        multiplier: '40.0',
        isCommunity: false,
      },
      {
        pid: 252,
        lpAddress: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
        token: {
          address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
          chainId: 56,
          decimals: 18,
          symbol: 'BUSD',
          name: 'Binance USD',
          projectLink: 'https://www.paxos.com/busd/',
        },
        quoteToken: {
          address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
          chainId: 56,
          decimals: 18,
          symbol: 'WBNB',
          name: 'Wrapped BNB',
          projectLink: 'https://www.binance.org',
        },
        lpSymbol: 'BUSD-BNB LP',
        tokenAmountTotal: '85097162.821685161673087371',
        quoteTokenAmountTotal: '256790.445568514120270961',
        lpTotalSupply: '3496273171783692722564025.0',
        lpTotalInQuoteToken: '489375.366480707458919044',
        tokenPriceVsQuote: '0.003017614654281713',
        poolWeight: '0.122905027932960893',
        multiplier: '11.0',
        isCommunity: false,
      },
      {
        pid: 253,
        lpAddress: '0x28415ff2C35b65B9E5c7de82126b4015ab9d031F',
        token: {
          chainId: 56,
          address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
          symbol: 'ADA',
          name: 'Cardano Token',
          decimals: 18,
        },
        quoteToken: {
          chainId: 56,
          address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
          symbol: 'WBNB',
          name: 'Wrapped BNB',
          decimals: 18,
        },
        lpSymbol: 'ADA-BNB LP',
        tokenAmountTotal: '9859118.560107316030909567',
        quoteTokenAmountTotal: '12157.258521887979966691',
        lpTotalSupply: '304281835036887189166672.0',
        lpTotalInQuoteToken: '21865.72057328434731409',
        tokenPriceVsQuote: '0.001233097913142008',
        poolWeight: '0.005586592178770949',
        multiplier: '0.5',
        isCommunity: false,
      },
    ]

    const farmWithPrices: FarmWithPrices[] = getFarmsPrices(
      farms,
      {
        address: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
        wNative: 'WBNB',
        stable: 'BUSD',
      },
      18,
    )
    expect(farmWithPrices[0].tokenPriceBusd).toEqual('4.696250514367906823')
    expect(farmWithPrices[0].quoteTokenPriceBusd).toEqual('331.387574149367784825')
    expect(farmWithPrices[0].lpTokenPrice).toEqual('83.350538798823178681')

    expect(farmWithPrices[1].tokenPriceBusd).toEqual('0.999999999999999999')
    expect(farmWithPrices[1].quoteTokenPriceBusd).toEqual('331.387574149367784825')
    expect(farmWithPrices[1].lpTokenPrice).toEqual('48.678783745190691397')

    expect(farmWithPrices[2].tokenPriceBusd).toEqual('0.408633326124777852')
    expect(farmWithPrices[2].quoteTokenPriceBusd).toEqual('331.387574149367784825')
    expect(farmWithPrices[2].lpTokenPrice).toEqual('26.48047925297142946')
  })
})
