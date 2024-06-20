import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { FarmPoolDetail } from 'views/Farms/FarmPoolDetail'

const FarmPoolDetailsPage = () => {
  return <FarmPoolDetail />
}

FarmPoolDetailsPage.chains = SUPPORT_FARMS

export default FarmPoolDetailsPage
