import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@pancakeswap/sdk'

export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'

export const bscRpcProvider = new StaticJsonRpcProvider({
  url: BSC_PROD_NODE,
  skipFetchSetup: true,
})

// @see https://github.com/ethers-io/ethers.js/issues/1886#issuecomment-934822755
export const bscTestnetRpcProvider = new StaticJsonRpcProvider({
  url: process.env.NEXT_PUBLIC_NODE_TESTNET || 'https://data-seed-prebsc-1-s2.binance.org:8545',
  skipFetchSetup: true,
})

export const ethMainnetRpcProvider = new StaticJsonRpcProvider({
  url: `https://eth-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_ETH}`,
  skipFetchSetup: true,
})

export const ethGoerliRpcProvider = new StaticJsonRpcProvider({
  url: `https://eth-goerli.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI}`,
  skipFetchSetup: true,
})

export const provider = ({ chainId }: { chainId?: ChainId }) => {
  if (chainId === ChainId.BSC_TESTNET) {
    return bscTestnetRpcProvider
  }
  if (chainId === ChainId.BSC) {
    return bscRpcProvider
  }
  if (chainId === ChainId.ETHEREUM) {
    return ethMainnetRpcProvider
  }
  if (chainId === ChainId.GOERLI) {
    return ethGoerliRpcProvider
  }
  return bscRpcProvider
}

export default null
