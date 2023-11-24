import { Address } from 'viem'
import { ChainId } from '@pancakeswap/chains'

export const chainlinkOracleBNB: Record<string, Address> = {
  [ChainId.BSC]: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
  [ChainId.BSC_TESTNET]: '0x',
}

export const chainlinkOracleCAKE: Record<string, Address> = {
  [ChainId.BSC]: '0xB6064eD41d4f67e353768aA239cA86f4F73665a1',
  [ChainId.BSC_TESTNET]: '0x',
}

export const chainlinkOracleETH: Record<string, Address> = {
  [ChainId.BSC]: '0x',
  [ChainId.BSC_TESTNET]: '0x',
  [ChainId.ARBITRUM_GOERLI]: '0xd5330586c035a67bd32A6FD8e390c72DB9372861',
}
