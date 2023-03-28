import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@pancakeswap/sdk'

export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'

export const bscRpcProvider = new StaticJsonRpcProvider(BSC_PROD_NODE)

export const bscTestnetRpcProvider = new StaticJsonRpcProvider(
  process.env.NEXT_PUBLIC_NODE_TESTNET || 'https://data-seed-prebsc-1-s2.binance.org:8545',
)

export const ethMainnetRpcProvider = new StaticJsonRpcProvider(
  `https://eth-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_ETH}`,
)

export const ethGoerliRpcProvider = new StaticJsonRpcProvider(
  `https://eth-goerli.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI}`,
)

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
