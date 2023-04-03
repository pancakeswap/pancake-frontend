import Pools from 'views/V3Info/views/PoolsPage'
import { InfoPageLayout } from 'views/V3Info/components/Layout'

const InfoPoolsPage = () => {
  return <Pools />
}

InfoPoolsPage.Layout = InfoPageLayout
InfoPoolsPage.chains = [] // set all

export default InfoPoolsPage
