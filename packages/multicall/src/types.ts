import { PublicClient } from 'viem'
import { ChainId } from '@pancakeswap/sdk'

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => PublicClient
