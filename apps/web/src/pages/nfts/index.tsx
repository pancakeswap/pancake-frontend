import NftMarket from 'views/Nft/market/Home'
import NftSubgraphWarning from 'views/Nft/market/NftSubgraphWarning'

const NftMarketPage = () => {
  return (
    <>
      <NftSubgraphWarning />
      <NftMarket />
    </>
  )
}

export default NftMarketPage
