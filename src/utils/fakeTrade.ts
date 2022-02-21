import { ChainId, JSBI, Pair, Route, Token, TokenAmount, Trade, TradeType } from '@pancakeswap/sdk'

export const createFakeTrade = () => {
  const token1 = new Token(ChainId.MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'BNB', 'BNB') // BNB
  const token2 = new Token(ChainId.MAINNET, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'BUSD') // BUSD
  const pair12 = new Pair(new TokenAmount(token1, JSBI.BigInt(10000)), new TokenAmount(token2, JSBI.BigInt(20000)))
  return new Trade(new Route([pair12], token1), new TokenAmount(token1, JSBI.BigInt(1000)), TradeType.EXACT_INPUT)
}
