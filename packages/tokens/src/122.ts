import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'

export const fuseTokens = {
  wfuse: WETH9[ChainId.FUSE],
  ice: new ERC20Token(ChainId.FUSE, '0x867f08A3ab824b42e8058a1B48e32E1dF205b092', 18, 'ICE', 'IceCream'),
  doge: new ERC20Token(ChainId.FUSE, '0x12AA82525DEfF84777fa78578A68ceB854A85f43', 18, 'DOGE', 'DogeCoin'),
  shiba: new ERC20Token(ChainId.FUSE, '0x8687cD1d02A28098571067ddB18F33fEF667C929', 18, 'SHIB', 'Shiba Inu'),
  usdt: new ERC20Token(ChainId.FUSE, '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10', 18, 'USDT', 'Tether USD'),
}
