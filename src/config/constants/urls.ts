import { ChainId } from '@pancakeswap/sdk'

export const EXCHANGE_URL = 'https://exchange.pancakeswap.finance'
export const INFO_URL = 'https://pancakeswap.info'
export const BASE_BSC_SCAN_URL = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}
