import { ChainId, Token, ETHER as bnb, Currency } from '@pancakeswap/sdk'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

export const mainnetTokens: TokenList = {
  cake: new Token(MAINNET, '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', 18, 'CAKE', 'PancakeSwap Token'),
  busd: new Token(MAINNET, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  wbnb: new Token(MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
  dai: new Token(MAINNET, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  usdt: new Token(MAINNET, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  btcb: new Token(MAINNET, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Binance BTC'),
  ust: new Token(MAINNET, '0x23396cf899ca06c4472205fc903bdb4de249d6fc', 18, 'UST', 'Wrapped UST Token'),
  eth: new Token(MAINNET, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'WBNB', 'Binance-Peg Ethereum Token'),
  usdc: new Token(MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'USDC', 'Binance-Peg USD Coin'),
}

export const testnetTokens: TokenList = {
  cake: new Token(TESTNET, '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe', 18, 'CAKE', 'PancakeSwap Token'),
  busd: new Token(TESTNET, '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', 18, 'BUSD', 'Binance USD'),
  wbnb: new Token(TESTNET, '0xae13d989dac2f0debff460ac112a837c89baa7cd', 18, 'WBNB', 'Wrapped BNB'),
  usdt: new Token(TESTNET, '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', 18, 'USDT', 'Tether USD'),
  btcb: new Token(TESTNET, '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', 18, 'BTCB', 'Binance BTC'),
  ust: new Token(MAINNET, '0x23396cf899ca06c4472205fc903bdb4de249d6fc', 18, 'UST', 'Wrapped UST Token'),
}

const tokenLists: { [chainId in ChainId]: TokenList } = {
  [MAINNET]: mainnetTokens,
  [TESTNET]: testnetTokens,
}

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return tokenLists[chainId] ? tokenLists[chainId] : tokenLists[ChainId.MAINNET]
}

export default tokens()
