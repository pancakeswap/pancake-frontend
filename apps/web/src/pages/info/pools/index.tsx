import Pools from 'views/Info/Pools'
import { InfoPageLayout } from 'views/Info'

const InfoPoolsPage = () => {
  return <Pools />
}

InfoPoolsPage.Layout = InfoPageLayout
InfoPoolsPage.chains = [] // set all

export default InfoPoolsPage
