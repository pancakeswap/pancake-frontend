import { useFetchCollections } from 'state/nftMarket/hooks'
import Collections from '../../../views/Nft/market/Collections'

const CollectionsPage = () => {
  useFetchCollections()
  return <Collections />
}

export default CollectionsPage
