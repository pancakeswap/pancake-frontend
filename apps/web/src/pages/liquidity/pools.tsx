import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { usePoolAprUpdater } from 'state/farmsV4/hooks'
import { UniversalFarms } from 'views/universalFarms'

const FarmsPage = () => {
  usePoolAprUpdater()

  return <UniversalFarms />
}

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
