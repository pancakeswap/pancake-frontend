import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@pancakeswap/sdk'

export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'

/**
 * @deprecated avoid using provider directly
 */
export const bscRpcProvider = new StaticJsonRpcProvider(
  {
    url: BSC_PROD_NODE,
    skipFetchSetup: true,
  },
  ChainId.BSC,
)
