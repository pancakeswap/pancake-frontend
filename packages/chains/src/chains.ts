import { defineChain } from 'viem'

export const endurance = defineChain({
  id: 648,
  name: 'Endurance',
  network: 'endurance',
  nativeCurrency: {
    decimals: 18,
    name: 'ACE',
    symbol: 'ACE',
  },
  rpcUrls: {
    default: { http: ['https://endurance2-rpc-partner.archivenode.club', 'https://rpc-endurance.fusionist.io'] },
    public: { http: ['https://endurance2-rpc-partner.archivenode.club', 'https://rpc-endurance.fusionist.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'EnduranceScan', url: 'https://explorer-endurance.fusionist.io' },
    default: { name: 'EnduranceScan', url: 'https://explorer-endurance.fusionist.io' },
  },
  contracts: {
    multicall3: {
      address: '0xecEb7Ee56dC35144610fd8616257a258C7A1Dcdc',
      blockCreated: 38181,
    },
  },
  testnet: false,
})
