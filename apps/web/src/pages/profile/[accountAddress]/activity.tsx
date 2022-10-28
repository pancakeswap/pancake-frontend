import { NftProfileLayout } from 'views/Profile'
import ActivityHistory from 'views/Profile/components/ActivityHistory'
import SubMenu from 'views/Profile/components/SubMenu'

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
