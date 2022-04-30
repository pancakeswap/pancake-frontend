import { NftProfileLayout } from 'views/Nft/market/Profile'
import ActivityHistory from 'views/Nft/market/Profile/components/ActivityHistory'
import SubMenu from 'views/Nft/market/Profile/components/SubMenu'

const NftProfileActivityPage = () => {
  return (
    <>
      <SubMenu />
      <ActivityHistory />
    </>
  )
}

NftProfileActivityPage.Layout = NftProfileLayout

export default NftProfileActivityPage
