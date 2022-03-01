import { Flex } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import FarmAuctionsBanner from './FarmAuctionsBanner'
import IFOBanner from './IFOBanner'

const HomeBanner = () => {
  const { account } = useWeb3React()

  const farmAuction = <FarmAuctionsBanner />
  const ifo = <IFOBanner />

  return farmAuction || ifo ? (
    <Flex
      flexDirection={['column', null, null, 'row']}
      pt={[account ? '220px' : '0', null, null, account ? '76px' : '0']}
      mt={[account ? '0' : '-16px', null, null, account ? '0' : '-48px']}
      pb="24px"
      style={{ gap: '16px' }}
    >
      <FarmAuctionsBanner />
      <IFOBanner />
    </Flex>
  ) : null
}

export default HomeBanner
