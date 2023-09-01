import { useContext } from 'react'
import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { FarmsV3PageLayout, FarmsV3Context } from 'views/Farms'
import { FarmV3Card } from 'views/Farms/components/FarmCard/V3/FarmV3Card'
import PresaleContainer from 'views/Presale'
import { getDisplayApr } from 'views/Farms/components/getDisplayApr'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useAccount } from 'wagmi'
import FarmCard from 'views/Farms/components/FarmCard/FarmCard'
import ProxyFarmContainer, {
  YieldBoosterStateContext,
} from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'

const Presale = () => {
  const { address: account } = useAccount()
  const { chosenFarmsMemoized } = useContext(FarmsV3Context)
  const cakePrice = usePriceCakeUSD()

  return <PresaleContainer />
}
Presale.chains = SUPPORT_FARMS

export default Presale
