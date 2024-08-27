import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { UniversalFarms } from 'views/universalFarms'

const FarmsPage = () => {
  return <UniversalFarms />
}

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
