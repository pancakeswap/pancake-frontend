import { ChainId } from '@pancakeswap/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://bsc-dataseed1.defibit.io',
  [ChainId.TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
}

export default NETWORK_URLS
