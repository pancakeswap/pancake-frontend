import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ChainId } from '@pancakeswap/chains'

const SubgraphHealthIndicator = dynamic(() => import('components/SubgraphHealthIndicator'), { ssr: false })

export const FixedSubgraphHealthIndicator = () => {
  const { pathname } = useRouter()
  const isOnNftPages = pathname.includes('nfts')
  return isOnNftPages ? <SubgraphHealthIndicator chainId={ChainId.BSC} subgraphName="pancakeswap/nft-market" /> : null
}
