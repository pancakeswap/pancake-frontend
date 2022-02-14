import NftMarket from 'views/Nft/market/Home'
import { useFetchCollections } from 'state/nftMarket/hooks'

const NftMarketPage = () => {
  useFetchCollections()
  return <NftMarket />
}

export default NftMarketPage
