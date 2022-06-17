import { FarmsMpPageLayout } from 'views/Farms'
import FarmsHistoryPage from 'pages/farms/history'

const MPFarmsHistoryPage = () => {
  return <FarmsHistoryPage />
}

MPFarmsHistoryPage.Layout = FarmsMpPageLayout
MPFarmsHistoryPage.mp = true

export default MPFarmsHistoryPage
