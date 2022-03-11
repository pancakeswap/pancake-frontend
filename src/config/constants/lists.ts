const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
const PANCAKE_TOP100 = 'https://tokens.pancakeswap.finance/pancakeswap-top-100.json'
const COINGECKO = 'https://tokens.pancakeswap.finance/coingecko.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  // COINGECKO,
  PANCAKE_TOP100,
  PANCAKE_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
