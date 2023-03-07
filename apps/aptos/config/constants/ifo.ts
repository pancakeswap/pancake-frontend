import { getIFOUID, IFO_POOL_STORE_TAG } from 'views/Ifos/constants'
import { mainnetTokens } from './tokens/1'
import { Ifo } from './types'

export const ifos: Ifo[] = [
  {
    id: 'move',
    address: `${IFO_POOL_STORE_TAG}<${mainnetTokens.cake.address}, ${mainnetTokens.move.address}, ${getIFOUID(1)}>`,
    isActive: true,
    name: 'MOVE',
    poolUnlimited: {
      saleAmount: '10,000,000 MOVE',
      raiseAmount: '$400,000',
      cakeToBurn: '$0',
      distributionRatio: 1,
    },
    campaignId: '1',
    currency: mainnetTokens.cake,
    token: mainnetTokens.move,
    releaseTime: 1675944000,
    articleUrl: 'https://medium.com/pancakeswap/bluemove-move-ifo-to-be-hosted-on-aptos-pancakeswap-25adee83d1ee',
    tokenOfferingPrice: 0.04,
    version: 3.2,
    twitterUrl: 'https://twitter.com/BlueMove_OA',
    description:
      'BlueMove is the leading multi-chain NFT Marketplace on Aptos and Sui, where creators can easily create their own NFTs, and freely list their collections for buying, selling and trading',
    vestingTitle: 'Stake $MOVE to access BlueMove Launchpad projects and earn platform fees',
  },
]

export default ifos
